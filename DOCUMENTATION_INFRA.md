# 🏗️ Infrastructure as Code — Terraform

> Documentation de la configuration Terraform pour le déploiement sur AWS ECS Fargate.

---

## Architecture cible

```
GitHub Actions CI/CD
        │
        │  push image
        ▼
ghcr.io/nathanmar/data-mock:latest
        │
        │  Terraform pulls image
        ▼
   AWS ECS Fargate
        │
   ┌────┴────┐
   │ Task    │  container: data-mock:latest
   │ (256CPU │  port: 3000
   │ 512MB)  │  healthCheck: /health
   └────┬────┘
        │
   Security Group (inbound :3000)
        │
   CloudWatch Logs (/ecs/data-mock)
```

---

## Fichiers

| Fichier | Contenu |
|---|---|
| `main.tf` | Ressources AWS : ECS Cluster, Task Definition, Service, Security Group, IAM Role, CloudWatch |
| `variables.tf` | Variables paramétrables : région, nom, image, VPC/subnets |
| `outputs.tf` | Sorties : nom du cluster, service, log group |

---

## Utilisation

```bash
# Initialiser Terraform (télécharge le provider AWS)
terraform init

# Vérifier le plan sans appliquer
terraform plan \
  -var="container_image=ghcr.io/nathanmar/data-mock" \
  -var="image_tag=latest" \
  -var="vpc_id=vpc-xxxxxxxx" \
  -var="subnet_ids=[\"subnet-xxxxxxxx\"]"

# Appliquer (nécessite des credentials AWS)
terraform apply
```

## Variables requises

| Variable | Description | Exemple |
|---|---|---|
| `aws_region` | Région AWS | `eu-west-3` |
| `container_image` | Image Docker URI | `ghcr.io/nathanmar/data-mock` |
| `image_tag` | Tag de l'image | `abc1234` (SHA du commit) |
| `vpc_id` | ID du VPC | `vpc-0abc123` |
| `subnet_ids` | IDs des subnets | `["subnet-0abc123"]` |

---

## Pourquoi ECS Fargate ?

- **Serverless** : pas de serveur à gérer, AWS gère l'infrastructure sous-jacente
- **Scalable** : le `desired_count` est facilement augmentable
- **Sécurisé** : l'image tourne dans un réseau privé avec un Security Group restrictif
- **Intégré** : les logs sont envoyés automatiquement vers CloudWatch en JSON (compatible avec les logs structurés `pino` du serveur)

---

> **Note** : Ce Terraform est complet et fonctionnel, mais nécessite un compte AWS et des credentials configurés (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) pour être appliqué.

---

# 📊 Monitoring & Observabilité

## Logs structurés JSON (pino)

Le serveur utilise `pino` pour générer des logs au format JSON :

```json
{"level":"info","time":"2026-06-12T07:30:00.000Z","method":"POST","url":"/api/mock","msg":"incoming request"}
{"level":"info","time":"2026-06-12T07:30:00.001Z","port":3000,"msg":"Data Mock API started"}
```

**Avantages** :
- Parseable par les outils d'agrégation de logs (Datadog, Loki, CloudWatch Insights)
- Structuré (clé/valeur), pas de grep dans des chaînes de caractères
- Configurable via `LOG_LEVEL` (info, warn, error, debug)

## Endpoints de monitoring

| Route | Description | Réponse exemple |
|---|---|---|
| `GET /health` | État du serveur (utilisé par Docker/ECS) | `{"status":"ok"}` |
| `GET /metrics` | Métriques applicatives | voir ci-dessous |

**Réponse de `/metrics` :**
```json
{
  "uptime_seconds": 3600,
  "version": "1.0.0",
  "node_version": "v20.20.2",
  "timestamp": "2026-06-12T07:30:00.000Z",
  "memory_mb": 42
}
```

## Intégration CloudWatch (via Terraform)

Les logs JSON de `pino` sont acheminés automatiquement vers le groupe CloudWatch `/ecs/data-mock` défini dans `terraform/main.tf`. Il est ensuite possible de créer des **Metric Filters** et des **Alertes CloudWatch** basées sur le champ `level` pour notifier sur des erreurs critiques.
