#!/bin/zsh
set -e
cd -- "${0:A:h}"
print 'Web Crawlers 蜘蛛演示'
print '在浏览器打开：http://127.0.0.1:5173'
print '保留此窗口即可运行；按 Control+C 停止。'
print '若提示端口已被占用，且演示已打开，直接访问上述网址即可。'
exec /usr/bin/python3 -m http.server 5173 --bind 127.0.0.1
