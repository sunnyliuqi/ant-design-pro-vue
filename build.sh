#!/bin/bash
if [[ ${CI_COMMIT_MESSAGE} =~ "@all" ]]
then
    echo '提交信息包含@all,需要更新安装依赖'
    yarn
else
    echo '不需要更新依赖'
fi
echo '开始构建项目'
cnpm yarn build
echo '复制构建文件到静态文件目录'
rm -rf /home/scda/project/html/admin
mv dist /home/scda/project/html/admin
