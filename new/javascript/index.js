function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g,"%27").replace(/"/g,"%22");  
}
function handleFiles(e){
        var id = $(e).attr("id");
        console.log(id);
        url = getObjectURL(e.files[0]);
        qrcode.decode(url);
        qrcode.callback = function(imgMsg){
            if (imgMsg=='error decoding QR Code') {alert('解析失败，请手动解码或者更换二维码！')}
            $('#'+id).val(imgMsg);
        }
}
function getObjectURL(file){
    let url = null ; 
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

$(document).ready(function() {
    $("input[type=\"file\"]").change(function($this) {
        handleFiles(this);
    });
    $('#shorten').click(function(){
        var tpl_id = $(":radio[name=tpl_id]:checked").val(); 
        if (tpl_id == null) { 
            layer.msg("请先选择生成模板！", { icon: 7 }); 
            return false;
        } 

        var loading = layer.msg('加载中,请稍候！', { icon: 16 ,shade: 0.01,time: 2000000});
        var ali = urlEncode($('#alipay_url').val()),
        vx = urlEncode($('#wechat_url').val()),
        qq = urlEncode($('#qq_url').val()),
        data = tpl_data[tpl_id];

        var qrImg = document.getElementById("temp");
        qrImg.crossOrigin = 'Anonymous';
        qrImg.src = 'https://api.uomg.com/api/qrcode.pay?alipay='+ali+'&vxpay='+vx+'&qqpay='+qq;
        $(qrImg).load(function(){
            setTimeout(resetCanvas(data,tpl_id,loading),500);
        });
       
    });
});

function resetCanvas(data,id,loading){
    console.log('resetCanvas');
    var BjImg = document.getElementById("tpl_"+id),
    canvas = document.createElement("canvas"),
    cxt = canvas.getContext("2d");

    BjImg.crossOrigin = 'Anonymous';
    BjImg.src = data['tpl_src'];

    $(BjImg).load(function(){
        canvas.width = data['tpl_w'];
        canvas.height = data['tel_h'];
        cxt.fillStyle = "#fff";
        cxt.fillRect(0,0,canvas.width,canvas.height);

        cxt.save();
        cxt.drawImage(BjImg,0,0);
        cxt.restore();

        createQr(canvas,data);
    });
}
function createQr(canvas,data,loading){
    console.log('createQr');
    var qrImg = document.getElementById("temp"),
    ncxt = canvas.getContext('2d');

    ncxt.drawImage(qrImg,data['qr_x'],data['qr_y'],data['qrsize'],data['qrsize']);
    mixEnd(canvas,loading);

};
function mixEnd(canvas,loading){
    console.log('mixEnd');
    var img = document.getElementById("qrcode");
    img.src = canvas.toDataURL("image/jpeg");
    img.style.display='block';
    layer.close(loading);
    layer.msg('长按保存图片，或者鼠标右键图片！');
};
