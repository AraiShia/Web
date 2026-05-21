# Git 部署脚本
# 推送到 Origin 的 standalone-site 分支

Write-Host "=== Git 部署到 Origin/standalone-site ===" -ForegroundColor Green

# 检查当前分支
$currentBranch = git branch --show-current
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

# 添加所有修改
Write-Host "`n1. 添加修改到暂存区..." -ForegroundColor Cyan
git add .

# 查看状态
Write-Host "`n2. 查看状态..." -ForegroundColor Cyan
git status

# 提交修改
Write-Host "`n3. 提交修改..." -ForegroundColor Cyan
git commit -m "feat: add inquiry management, privacy policy, and cookie consent

- Add inquiry management module with CSV export
- Add privacy policy page and cookie policy page
- Add cookie consent banner for first-time visitors
- Update contact form with B2B fields (phone, company, product)
- Fix persistent data paths for Hostinger deployment
- Add token-based authentication for admin panel"

# 推送到 Origin standalone-site
Write-Host "`n4. 推送到 Origin standalone-site..." -ForegroundColor Cyan
git push origin standalone-site

Write-Host "`n=== 部署完成 ===" -ForegroundColor Green
Write-Host "访问: https://AraiShia.github.io/Web (如果 GitHub Pages 已启用)" -ForegroundColor Yellow

pause
