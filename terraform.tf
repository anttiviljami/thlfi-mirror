provider "aws" { region = "eu-west-1" }

terraform {
  backend "s3" {
    bucket = "thlfi-mirror-terraform"
    key = "terraform.tfstate"
    region = "eu-west-1"
  }
}

resource "aws_s3_bucket" "static" {
  bucket = "thl-fi-mirror"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  acl = "public-read"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": ["arn:aws:s3:::thl-fi-mirror/*"]
    }
  ]
}
EOF
}

resource "aws_cloudfront_distribution" "static" {
  depends_on = ["aws_s3_bucket.static"]
  enabled = true
  retain_on_delete = true
  is_ipv6_enabled = true

  price_class = "PriceClass_100"

  origin {
    domain_name = "thl-fi-mirror.s3-website-eu-west-1.amazonaws.com"
    origin_id = "thl-fi-mirror"
    custom_origin_config {
      http_port = "80"
      https_port = "443"
      origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_protocol_policy = "http-only"
    }
  }
  default_root_object = "index.html"

  aliases = ["thl.viljami.io"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:921809084865:certificate/e6439ca4-64ec-4998-8103-4e607d3edc10"
    ssl_support_method = "sni-only"
  }

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = [ "GET", "HEAD", "OPTIONS" ]
    cached_methods = [ "GET", "HEAD" ]
    target_origin_id = "thl-fi-mirror"
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
    compress = true
    min_ttl = 0
    default_ttl = 360
    max_ttl = 86400
  }
}

