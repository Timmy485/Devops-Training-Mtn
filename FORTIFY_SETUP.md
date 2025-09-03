# Fortify Security Scan Setup Guide

This document explains how to configure the Fortify security scanning workflow for the DevSecOps Agent project.

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. Fortify ScanCentral Configuration
- **`FORTIFY_SCANCENTRAL_URL`**: The URL of your Fortify ScanCentral server
  - Example: `https://fortify-scancentral.company.com`
- **`FORTIFY_TOKEN`**: Authentication token for Fortify ScanCentral
  - This should be a valid API token with scan permissions

### 2. AWS Credentials (for DAST testing)
- **`AWS_ACCESS_KEY_ID_UAT`**: AWS access key for UAT environment
- **`AWS_SECRET_ACCESS_KEY_UAT`**: AWS secret key for UAT environment

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

## Workflow Configuration

### Trigger Conditions
The Fortify security scan workflow runs:
- On push to `dev` branch
- On pull requests to `dev` branch
- After the main CI/CD pipeline completes on `dev` branch

### Scan Types

#### SAST (Static Application Security Testing)
- **Scan Type**: SCA (Software Composition Analysis)
- **Target**: Source code analysis
- **Thresholds**:
  - Critical issues: 0 (fails build)
  - High issues: 5 (fails build)
  - Medium/Low: Reported but don't fail build

#### DAST (Dynamic Application Security Testing)
- **Scan Type**: DAST
- **Target**: Running application
- **Thresholds**:
  - Critical issues: 0 (fails build)
  - High issues: 3 (fails build)
  - Medium/Low: Reported but don't fail build

### Scan Process

1. **SAST Scan**:
   - Downloads Fortify ScanCentral CLI
   - Configures authentication
   - Runs static code analysis
   - Waits for completion (up to 15 minutes)
   - Downloads and parses results

2. **DAST Scan**:
   - Deploys application from ECR
   - Waits for application to be ready
   - Runs dynamic security testing
   - Waits for completion (up to 30 minutes)
   - Downloads and parses results
   - Cleans up test environment

3. **Security Summary**:
   - Generates comprehensive report
   - Comments on pull requests
   - Uploads artifacts for 30 days

## Artifacts Generated

- **`fortify-sast-results`**: SAST scan results (.fpr file)
- **`fortify-dast-results`**: DAST scan results (.fpr file)
- **Security Report**: Summary in GitHub Actions UI

## Customization

### Adjusting Thresholds
To modify security thresholds, edit the workflow file:

```yaml
# SAST thresholds
if [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo "❌ SAST scan failed: $CRITICAL_COUNT critical issues found"
  exit 1
elif [ "$HIGH_COUNT" -gt 5 ]; then  # Change this number
  echo "⚠️ SAST scan warning: $HIGH_COUNT high issues found"
  exit 1
fi
```

### Scan Timeouts
Modify scan timeouts in the workflow:

```yaml
# SAST timeout (30 attempts × 30 seconds = 15 minutes)
for i in {1..30}; do

# DAST timeout (60 attempts × 30 seconds = 30 minutes)
for i in {1..60}; do
```

### Application Configuration
Update environment variables for DAST testing:

```yaml
docker run -d \
  --name dast-test-app \
  -p 3001:3001 \
  -e NODE_ENV=development \
  -e PORT=3001 \
  -e API_KEY=test-api-key \
  # Add more environment variables as needed
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify `FORTIFY_TOKEN` is valid and has proper permissions
   - Check `FORTIFY_SCANCENTRAL_URL` is correct

2. **Scan Timeout**
   - Increase timeout values in the workflow
   - Check Fortify server performance

3. **Application Not Ready**
   - Verify health endpoint is working
   - Check application logs in the workflow

4. **High Issue Count**
   - Review and fix security issues
   - Adjust thresholds if needed

### Logs and Debugging

- Check GitHub Actions logs for detailed error messages
- Download artifacts to view detailed scan results
- Use Fortify SSC (Software Security Center) for detailed analysis

## Integration with CI/CD

The security scan workflow integrates with the main CI/CD pipeline:

1. Main pipeline builds and pushes Docker image
2. Security scan workflow triggers automatically
3. SAST scan runs on source code
4. DAST scan runs on deployed application
5. Results are reported and artifacts stored

## Security Best Practices

1. **Regular Scans**: Scans run on every dev branch push
2. **Fail Fast**: Critical issues fail the build immediately
3. **Artifact Retention**: Results stored for 30 days
4. **PR Integration**: Automatic comments on pull requests
5. **Threshold Management**: Configurable security thresholds

## Support

For issues with Fortify configuration or scan results:
1. Check Fortify documentation
2. Review GitHub Actions logs
3. Contact your Fortify administrator
4. Review security team guidelines
