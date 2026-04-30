---
description: Comprehensive security review with guardrails, secret scanning, and structured findings documentation.
model: mimo-v2.5-pro
thinking: medium
chain: guard-check -> secret-scan -> code-review -> document
chainContext: full
boomerang: false
worktree: false
---

## Step: Guardrail Check
Tool: pi-guardrails
Context: full

Verify security posture:
1. Check for exposed environment variables or secrets
2. Verify file permissions on sensitive files
3. Review git history for accidentally committed secrets

## Step: Secret Scanning
Tool: pi-secret-guard
Context: summary

Scan for secrets and credentials:
1. Scan project files for API keys, tokens, passwords
2. Check environment configuration for exposed values
3. Review session history for accidentally shared credentials
4. Report all findings with severity levels

## Step: Security Code Review
Tool: pi-show-diffs
Context: summary

Review code for security vulnerabilities:
1. Check for common vulnerability patterns (OWASP Top 10)
2. Verify input validation and sanitization
3. Review authentication and authorization logic
4. Check for insecure dependencies

## Step: Security Report
Tool: pi-specdocs
Context: summary

Generate security audit report:
1. Summarize all findings with severity ratings
2. Provide remediation steps for each finding
3. Prioritize fixes by risk level
4. Create an ADR for any security architecture changes needed