variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "eu-west-3"
}

variable "app_name" {
  description = "Application name used as prefix for all resources"
  type        = string
  default     = "data-mock"
}

variable "environment" {
  description = "Deployment environment (staging or production)"
  type        = string
  default     = "staging"
}

variable "container_image" {
  description = "Docker image URI (e.g. ghcr.io/nathanmar/data-mock)"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag (e.g. git commit SHA)"
  type        = string
  default     = "latest"
}

variable "vpc_id" {
  description = "VPC ID where the ECS service will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ECS service"
  type        = list(string)
}
