/**
 * Created by iTEC001 on 2015/8/14.
 */
'use strict';

// 数据过滤
MetronicApp.filter('convert', function() {
    return function(input) {
        if (input=='1') {
            return input='待运送';
        }
        else if(input=='2'){
            return input='确认收款';
        }
        else if(input=='3'){
            return input='取消收款';
        }
        else if(input=='4'){
            return input='待安排备货';
        }
        else if(input=='10'){
            return input='已安排仓库备货';
        }

        else if(input=='16'){
            return input='仓库待备货';
        }
        else if(input=='11'){
            return input='仓库备货完成';
        }

        else if(input=='32'){
            return input='待安排装柜';
        }
        else if(input=='31'){
            return input='已安排装柜';
        }

        else if(input=='64'){
            return input='物流待装柜';
        }
        else if(input=='63'){
            return input='物流已装柜';
        }

       else if(input=='128') {
            return input = '已装柜,待生成运单';
        }
        else if (input=='127'){
            return input='已生成运单,待运送';
        }
        else if (input=='256'){
            return input='待收货';
        }
        else if (input=='512'){
            return input='已签收';
        }
    }
});

MetronicApp.filter('optionFilter', function () {
    return function (input) {
        if(input =='1'){
            return input= "确认收款";
        }
        else if(input =='2'){
            return input= "确认收款";
        }
        else if(input =='3'){
            return input= "取消收款";
        }
        else if(input =='4'){
            return input= "安排备货";
        }
        else if(input =='10'){
            return input= "取消安排";
        }
        else if(input =='16'){
            return input= "备货完成";
        }
        else if(input =='11'){
            return input= "取消备货";
        }
        else if(input =='32'){
            return input= "安排装柜";
        }
        else if(input =='31'){
            return input= "取消安排";
        }
        else if(input =='64'){
            return input= "打包装柜";
        }
        else if(input =='63'){
            return input= "取消装柜";
        }
        else if(input =='128'){
            return input= "生成运单";
        }
        else if(input =='127'){
            return input= "生成成功";
        }
        else if(input =='256'){
            return input= "生成成功";
        }

    }
});

MetronicApp.filter('DeliveryFilter', function () {
    return function (input) {
        if(input =='1'){
            return input= "启运登记";
        }
        else if(input =='11'){
            return input= "取消登记";
        }
        else if(input =='2'){
            return input= "到站卸货";
        }
        else if(input =='12'){
            return input= "取消卸货";
        }
        else if(input =='4'){
            return input= "运单完成";
        }

    }
});

MetronicApp.filter('DeliveryConvert', function() {
    return function(input) {
        if (input == '1') {
            return input = '运单登记';
        }
        else if(input == '11'){
            return input = '运单已登记，待运送';
        }

        else if(input == '2'){
            return input = '运送中';
        }
        else if(input == '12'){
            return input = '运送完成，待收货';
        }

        else if(input == '4'){
            return input = '待收货';
        }
        else if(input == '8'){
            return input = '运单结案';
        }

    }
});

MetronicApp.filter("DateFilter", function () {
    return function (input) {
       return input.split(" ")[0];
    }
});

MetronicApp.filter("AccountFilter", function () {
    return function (input) {
        if(input ==1){
            return input= "工厂";
        }
        else if(input ==2){
            return input= "分公司";
        }
        else if(input ==3){
            return input= "直销商";
        }
        else if(input ==4){
            return input= "经销商";
        }
        else if(input ==5){
            return input= "消费者";
        }
    }
});






