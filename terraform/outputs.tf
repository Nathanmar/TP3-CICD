output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.app.name
}

output "log_group_name" {
  description = "CloudWatch log group for the application"
  value       = aws_cloudwatch_log_group.app.name
}
