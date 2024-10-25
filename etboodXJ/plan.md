# 计划
前端&合约端交互 walrus

## 目标
1. 完成前端页面搭建
2. 完成合约端交互walrus
3. 完成测试

## 目录结构
1. fontend 
  dappkit
2. move
  sui move
3. test
  unit test

## 推进
完成walrus的二进制安装

如果是ubuntu系统 首先下载bin文件并改名walrus后执行

```
sudo cp walrus /usr/bin
```

官网

https://sdk.mystenlabs.com/dapp-kit/create-dapp

执行命令 

```
npm create @mysten/dapp

Which starter template would you like to use? · react-e2e-counter
√ What is the name of your dApp? (this will be used as the directory name) · oneclick
```

根据dappkit的指示 pnpm install 和 pnpm dev 启动项目并测试是否顺利打包

```
vite v5.4.10 building for production...
✓ 725 modules transformed.
dist/index.html                   1.23 kB │ gzip:   0.64 kB
dist/assets/index-JlcvU8e4.css  703.58 kB │ gzip:  83.67 kB
dist/assets/index-DZXkWKhh.js   585.28 kB │ gzip: 188.46 kB
```

根据目标 修改 tsx 文件 和 move文件 

领取取testnet的sui
```
sui client faucet
```

命令行方式获取wal
```
walrus get-wal
```

根据文档安装 walrus-sites

https://docs.walrus.site/walrus-sites/tutorial-install.html

编译后 执行

windows11发布成功但无法打开网页

target\release\site-builder --config sites-config.yaml  publish --epochs 200 --site-name oneclick distoneclick

ubuntu20.04 发布成功 可以打开网页!

./target/release/site-builder --config ./sites-config.yaml  publish --epochs 200 --site-name oneclick ./distoneclick

sites-config.yaml 配置文件 testnet 测试网的配置,原来的builder-example.yaml 已经不用了

发布网页到walrus上并获得object id

Resource operations performed:
  - created resource /assets/index-DZXkWKhh.js with blob ID qifvtgYu814eQ8q3DRvEHBW0HIg_MJkhshleFVXN_pc
  - created resource /assets/index-JlcvU8e4.css with blob ID -TMM0MZLzPr0fotR0245dKCSsdrCMVxR1NW1u982CAk
  - created resource /index.html with blob ID tX4p-aVoXT15QXBD54Wx6nIQi4oVlY6kSZFqWShtO9E
The site routes were left unchanged

Created new site: oneclick
New site object ID: 0xa2345dee940ac6cbca06405c4d4d246cd224cccf380a98956b64b773d5669b72
Browse the resulting site at: https://41jfnjnz4tzlsfsr3vedxzfwcpoyf0gy6o2r48l2kg8gbq5wtu.walrus.site

在 https://testnet.suins.io/account/my-names 上注册一个名字并指向object id
这里我们设置为 oneclick
https://oneclick.walrus.site



