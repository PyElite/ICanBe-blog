jQuery.fn.wait = function (func, times, interval) { 
var _times = times || -1, //100次 
_interval = interval || 20, //20毫秒每次 
_self = this, 
_selector = this.selector, //选择器 
_iIntervalID; //定时器id 
if( this.length ){ //如果已经获取到了，就直接执行函数 
func && func.call(this); 
} else { 
_iIntervalID = setInterval(function() { 
if(!_times) { //是0就退出 
clearInterval(_iIntervalID); 
} 
_times <= 0 || _times--; //如果是正数就 -- 

_self = $(_selector); //再次选择 
if( _self.length ) { //判断是否取到 
func && func.call(_self); 
clearInterval(_iIntervalID); 
} 
}, _interval); 
} 
return this; 
}

$(document).ready(function(){

	$('#SOHU_MAIN .head-img-gw img').wait(function(){
		var imgs = new Array();
		imgs[0] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525111154.jpg';
		imgs[1] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525111447.jpg';
		imgs[2] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525112058.jpg';
		imgs[3] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525112112.jpg';
		imgs[4] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525112129.jpg';
		imgs[5] = 'http://qiniu.cuiqingcai.com/wp-content/uploads/2015/05/20150525112155.jpg';
		
			
		$('.head-img-gw img[src*="avatar"]').each(function(){
			var rand = Math.floor(Math.random()*imgs.length);
			$(this).attr("src",imgs[rand]);
		});
	});
	$('#SOHUCS #SOHU_MAIN .section-cbox-w .post-default-b').wait(function(){
		setTimeout(function() {
			$('#SOHU_MAIN .section-cbox-w .post-default-b').css('border', '1px solid #ccd4d9');
		}, 200);
	});


		// TBUI
	window.TBUI = window.TBUI || {}

    TBUI.bd = $('body')
    TBUI.siteurl = TBUI.siteurl
    TBUI.uri = TBUI.uri
	TBUI.ajaxpager = TBUI.ajaxpager ? Number(TBUI.ajaxpager) : 10
    TBUI.pagenum = TBUI.pagenum ? Number(TBUI.pagenum) : 20
    TBUI.shareimage = TBUI.shareimage || ''
	TBUI.shareimagethumb = TBUI.shareimagethumb ? Number(TBUI.shareimagethumb) : 1
	TBUI.is_login_popup = TBUI.is_login_popup ? Number(TBUI.is_login_popup) : 1
	TBUI.click = 'click'



	$(".m-navbar-start").on("click", function() {
    	TBUI.bd.toggleClass("m-navbar-on")
	});
	$(".m-mask").on("click", function() {
	    TBUI.bd.removeClass("m-navbar-on"),
	    TBUI.bd.removeClass("m-wel-on")
	});
	$(".m-wel-start").on("click", function() {
	    TBUI.bd.toggleClass("m-wel-on")
	});
	$("#search").on("click", function(e) {
	    $("#header-search-dropdown").toggleClass("is-active")
	});

	if (TBUI.is_header_fixed == 1) {
		if ($(window).width() > 1024 ) {
			var fixedheader = $('header.header');
			$(window).scroll(function() {
				var h = document.documentElement.scrollTop + document.body.scrollTop;
				if (h > 88) {
					fixedheader.addClass('fixed');
					$('body').addClass('fixed');
				}else{
					fixedheader.removeClass('fixed')
					$('body').removeClass('fixed')
				}
			})
		}
	}
	 // CONET download_popup A
    $("#download-popup").on("click",function(){
        var url = $(this).attr('data-url');
        var info = $(this).attr('data-info');
        if (!info) {info='无需密码'}
        popup.showCustomModal({
            template: "Download",  // AlipayQrcode; WeixinpayQrcode ;Popup；PayMethod
            layerClose: 1,
            data: {
		        url: url,
		        info:info
		    }
        });
        return false;
    });

 	// 弹窗登录 alert
	if (TBUI.is_login_popup == 1) {
		var etap_login = $('[etap="login_btn"]');
		var etap_register = $('[etap="register_btn"]');
		var oauth_html = '';
		var email_reg_html = '';
		if (TBUI.is_oauth_qq == 1) {
			oauth_html = '<div class="sign-qq"> <a href="'+TBUI.uri+'/oauth/qq?rurl='+window.location.href+'" title="使用QQ账户登录"></a> </div>';
		}
		if (TBUI.is_email_reg == 1) {
			email_reg_html = '<div class="item"> <input class="ipt" id="captcha" type="text" name="captcha" placeholder="输入验证码" required="" /> <span class="captcha-clk inline">发送邮箱验证码</span> </div>';
		}
		etap_login.on(TBUI.click,function(e){
			e.preventDefault();
			// $("footer .popup-login").remove();
		    popup.showCustomModal({
		        template: "Login",
		        layerClose: 1,
		        data: {
			        html: oauth_html
			    }
		    });

		});
		etap_register.on(TBUI.click,function(e){
			e.preventDefault();
			$("footer .popup-register").remove();
		    popup.showCustomModal({
		        template: "Register",
		        layerClose: 1,
		        data: {
			        html: oauth_html,
			        email_html: email_reg_html
			    }
		    });
		})

	}

	// LOGING REG
	//REMOVE THIS - it's just to show error messages
	$('.sign-form').find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		$('.sign-form').find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
	});



	//登陆
	$(document).ready(function() {
		var _loginTipstimer
		function logtips(str){
			if( !str ) return false
			_loginTipstimer && clearTimeout(_loginTipstimer)
			$('.sign-tips').html(str).animate({
				height: 60
			}, 220)
			_loginTipstimer = setTimeout(function(){
				$('.sign-tips').animate({
					height: 0
				}, 220)
			}, 5000)
		}

		function is_check_name(str) {
			return /^[\w]{3,16}$/.test(str)
		}
		function is_check_mail(str) {
			return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)
		}


		$('body').on('click','.captcha-clk',function(){
			if( !is_check_mail($("#user_email").val()) ){
				logtips('邮箱格式错误')
				return
			}

			var captcha = $(this);
			if(captcha.hasClass("disabled")){
				logtips('您操作太快了，等等吧')
			}else{
				captcha.addClass("disabled");
				captcha.html("发送中...");
				$.post(
					TBUI.uri+'/action/captcha.php?'+Math.random(),
					{
						action: "WPAY_captcha",
						email:$("#user_email").val()
					},
					function (data) {
						if($.trim(data) == "1"){
							logtips('已发送验证码至邮箱')
							var countdown=60;
							settime()
							function settime() {
								if (countdown == 0) {
									captcha.removeClass("disabled");
									captcha.html("发送验证码");
									countdown = 60;
									return;
								} else {
									captcha.addClass("disabled");
									captcha.html("重新发送(" + countdown + ")");
									countdown--;
								}
								setTimeout(function() { settime() },1000)
							}

						}else if($.trim(data) == "2"){
							logtips('邮箱已存在')
							captcha.html("发送验证码");
							captcha.removeClass("disabled");
						}else if($.trim(data) == "3"){
							logtips('该站点未启用SMTP邮件功能')
							captcha.html("发送验证码");
							captcha.removeClass("disabled");
						}else{
							logtips('验证码发送失败，请稍后重试')
							captcha.html("发送验证码");
							captcha.removeClass("disabled");
						}
					}
				);
			}
		});

		$('body').on('click', '.login-loader',function(){
			logtips("登录中，请稍等...");
			$.post(
				TBUI.uri+'/action/login.php',
				{
					usr: $("#username").val(),
					pwd: $("#password").val(),
					rememberme: $('#rememberme').val(),
					action: "WPAY_login"

				},
				function (data) {
					if (parseInt(data) != "1") {
						logtips("用户名或密码错误");
					}
					else {
						logtips("登录成功，跳转中...");
						location.reload();
					}
				}
			);
		})
		$('body').on('click', '.register-loader',function(){
			if( !is_check_name($("#user_name").val()) ){
				logtips('用户名只能由字母数字或下划线组成的3-16位字符')
				return
			}

			if( !is_check_mail($("#user_email").val()) ){
				logtips('邮箱格式错误')
				return
			}

			if( $("#user_pass").val().length < 6 ){
				logtips('密码太短，至少6位')
				return
			}

			if( $("#user_pass").val() != $("#user_pass2").val()){
				logtips('两次输入密码不一致')
				return
			}

			logtips("注册中，请稍等...");
			$.post(
				TBUI.uri+'/action/login.php',
				{
					user_register: $("#user_name").val(),
					user_email: $("#user_email").val(),
					password: $("#user_pass").val(),
					captcha: $("#captcha").val(),
					action: "WPAY_register"
				},
				function (data) {
					if (parseInt(data) == 1) {
						logtips("注册成功，登录中...");
						location.reload();
					}
					else {
						logtips(data);
					}
				}
			);
		})
	});

	
});

$(function(){
	// $('a').on('click', function(){
	// 	console.log($("#iframeu2027169_0").contents().html());
	// 	console.log($("#iframeu1959939_0").contents().find('.container a:first-child').attr('href'));
	// 	$('#iframeu1959939_0').contents().find('.container a:first-child').click();
	// });
	
});


// window.prettyPrint && window.prettyPrint()
// // document main page
// $(document).ready(function(){
//
// 	$('[etap="share"]').on(TBUI.click, function(){
// 		var dom = $(this)
// 	    var to = dom.data('share')
// 	    var url = ''
// 	    switch(to){
// 	        case 'qq':
// 	            url = 'http://connect.qq.com/widget/shareqq/index.html?url='+share.url+'&desc='+share.desc+'&summary='+share.title+'&site=zeshlife&pics='+share.pic
// 	            break;
//
// 	        case 'weibo':
// 	            url = 'http://service.weibo.com/share/share.php?title='+share.title+'&url='+share.url+'&source=bookmark&pic='+share.pic
// 	            break;
//
// 	        case 'douban':
// 	            url = 'http://www.douban.com/share/service?image='+share.pic+'&href='+share.url+'&name='+share.title+'&text='+share.desc
// 	            break;
//
// 	        case 'qzone':
// 	            url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+share.url+'&title='+share.title+'&desc='+share.desc
// 	            break;
//
// 	        case 'tqq':
// 	            url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url='+share.url+'&title='+share.title
// 	            break;
//
// 	        case 'renren':
// 	            url = 'http://widget.renren.com/dialog/share?srcUrl='+share.pic+'&resourceUrl='+share.url+'&title='+share.title+'&description='+share.desc
// 	            break;
//
// 	        case 'line':
// 	            url = 'http://line.naver.jp/R/msg/text/?'+share.title+'%0D%0A'+share.url
// 	            break;
//
// 	        case 'twitter':
// 	            url = 'https://twitter.com/intent/tweet?text='+share.title+'&url='+share.url
// 	            break;
//
// 	        case 'facebook':
// 	            url = 'https://www.facebook.com/sharer/sharer.php?u='+share.url+'&title='+share.title+'&description='+share.desc
// 	            break;
// 	    }
//
// 	    if( !dom.attr('href') && !dom.attr('target') ){
// 	    	dom.attr('href', url).attr('target', '_blank')
// 	    }
// 	})
// })