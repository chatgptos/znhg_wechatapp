//list.js
var api = require('../../api.js');
var app = getApp();

Page({
    data: {
        array: []
    },
    onLoad: function () {
        this.setData({
            array: [{
                imgurl:'../../Img/2.jpg',
                name:'好友申请',
                msg:'太阳 向您申请为好友…',
                date:'09:05 08/3/23'
            }, {
                imgurl: '../../Img/bg1.jpg',
                name: '好友申请',
                msg: '太阳 向您申请为好友…',
                date: '09:05 08/3/23'
            }, {
                imgurl: '../../Img/add.png',
                name: '好友申请',
                msg: '太阳 向您申请为好友…',
                date: '09:05 08/3/23'
            }]
        })
    }
})