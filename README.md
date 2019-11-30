# PointLite

基于微信小程序的记账工具

## 描述

该微信小程序基于“小程序·云开发”平台，使用了微信官方提供的数据库，文件存储以及云函数功能
- [2019-中国高校计算机大赛微信小程序应用开发赛参赛作品](https://developers.weixin.qq.com/community/competition)
- 提供简单的记账操作，数据统计与分析
- 使用了 iView Weapp 的部分控件与布局模板，[点击此处](https://weapp.iviewui.com/)查看 iView Weapp 的相关介绍
- 部分界面设计参考 [Weapp-Demo-LemonJournal](https://github.com/goolhanrry/Weapp-Demo-LemonJournal) 
- 已进行脱敏处理，请在运行前确认你的微信开发者信息并将相应的信息填入代码中

## 目录

- [项目名称](#PointLite)
- [项目描述](#描述)
- [目录](#目录)
- [文件结构](#文件结构)
- [界面演示](#部分界面演示)
- [参考文档](#参考文档)

## 文件结构

    .
    |-- .gitignore
    |-- package-lock.json
    |-- project.config.json
    |-- README.md
    |-- cloudfunctions
    |   |-- getData
    |   |   |-- index.js
    |   |   |-- package.json
    |   |-- getYearData
    |   |   |-- index.js
    |   |   |-- package.json
    |   |-- handleDatabase
    |   |   |-- index.js
    |   |   |-- package.json
    |   |-- login
    |       |-- index.js
    |       |-- package.json
    |-- miniprogram
        |-- app.js
        |-- app.json
        |-- app.wxss
        |-- sitemap.json
        |-- components
        |   |-- alert
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- badge
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- button
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- cell
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- cell-group
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |-- col
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- collapse
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- collapse-item
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- grid
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- grid-item
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- helpers
        |   |   |-- arrayTreeFilter.js
        |   |   |-- baseBehavior.js
        |   |   |-- baseComponent.js
        |   |   |-- checkIPhoneX.js
        |   |   |-- classNames.js
        |   |   |-- colors.js
        |   |   |-- computedBehavior.js
        |   |   |-- debounce.js
        |   |   |-- funcBehavior.js
        |   |   |-- gestures.js
        |   |   |-- isEmpty.js
        |   |   |-- mergeOptionsToData.js
        |   |   |-- relationsBehavior.js
        |   |   |-- safeSetDataBehavior.js
        |   |   |-- shallowEqual.js
        |   |   |-- styleToCssString.js
        |   |-- icon
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- input
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- journalBook
        |   |   |-- journalBook.js
        |   |   |-- journalBook.json
        |   |   |-- journalBook.wxml
        |   |   |-- journalBook.wxss
        |   |-- navbar
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- panel
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- progress
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- row
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- segmented-control
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- spin
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- tab
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- tabs
        |   |   |-- index.js
        |   |   |-- index.json
        |   |   |-- index.wxml
        |   |   |-- index.wxss
        |   |-- wxs
        |       |-- array.wxs
        |       |-- bem.wxs
        |       |-- memoize.wxs
        |       |-- object.wxs
        |       |-- utils.wxs
        |-- images
        |   |-- 1.png
        |   |-- 10.png
        |   |-- 11.png
        |   |-- 12.png
        |   |-- 5.png
        |   |-- icons
        |       |-- about1.png
        |       |-- add-icon.png
        |       |-- app_icon.png
        |       |-- feedback1.png
        |       |-- headphone1.png
        |       |-- lock1.png
        |       |-- note-1.png
        |       |-- note-2.png
        |       |-- remove.png
        |       |-- return.png
        |       |-- settings.png
        |       |-- setting_1.png
        |       |-- setting_2.png
        |       |-- submit.png
        |-- lib
        |   |-- font.wxss
        |   |-- fontAwesome.wxss
        |   |-- iconfont.wxss
        |-- pages
        |   |-- about
        |   |   |-- about.js
        |   |   |-- about.json
        |   |   |-- about.wxml
        |   |   |-- about.wxss
        |   |-- detail
        |   |   |-- detail.js
        |   |   |-- detail.json
        |   |   |-- detail.wxml
        |   |   |-- detail.wxss
        |   |-- introduce
        |   |   |-- introduce.js
        |   |   |-- introduce.json
        |   |   |-- introduce.wxml
        |   |   |-- introduce.wxss
        |   |-- logIn
        |   |   |-- logIn.js
        |   |   |-- logIn.json
        |   |   |-- logIn.wxml
        |   |   |-- logIn.wxss
        |   |-- manage
        |   |   |-- manage.js
        |   |   |-- manage.json
        |   |   |-- manage.wxml
        |   |   |-- manage.wxss
        |   |-- note
        |   |   |-- note.js
        |   |   |-- note.json
        |   |   |-- note.wxml
        |   |   |-- note.wxss
        |   |-- setting
        |   |   |-- setting.js
        |   |   |-- setting.json
        |   |   |-- setting.wxml
        |   |   |-- setting.wxss
        |   |-- share
        |       |-- share.js
        |       |-- share.json
        |       |-- share.wxml
        |       |-- share.wxss
        |-- utils
            |-- util.js
            |-- wxcharts.js

## 部分界面演示

<p align="center">
  <img width="200" src="Screenshots/1.png" hspace="30px" />
  <img width="200" src="Screenshots/2.png" hspace="30px" />
  <img width="200" src="Screenshots/3.png" hspace="30px" />
</p>

<p align="center">
  <img width="200" src="Screenshots/4.png" hspace="30px" />
  <img width="200" src="Screenshots/5.png" hspace="30px" />
  <img width="200" src="Screenshots/6.png" hspace="30px" />
</p>

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

