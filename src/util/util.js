/*-----------------------------日期格式化-------------------------------*/
	Date.prototype.format = function(fmt) {
	  var o = {
	    "M+" : this.getMonth()+1,                 //月份
	    "d+" : this.getDate(),                    //日
	    "h+" : this.getHours(),                   //小时
	    "m+" : this.getMinutes(),                 //分
	    "s+" : this.getSeconds(),                 //秒
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度
	    "S"  : this.getMilliseconds()             //毫秒
	  };
	  if(/(y+)/.test(fmt))
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)
	    if(new RegExp("("+ k +")").test(fmt))
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	  return fmt;
	}

	/*-----------------------------获取标准格式时间-------------------------------*/
	function formatTime(val){
		try{
			var date = new Date(val);
			var res = date.format("yyyy-MM-dd hh:mm");
			return res;
		}catch(e){
			//TODO handle the exception
			console.log(e);
			return "";
		}
	}

	function isEmptyObject(e) {
	    var t;
	    for (t in e)
	        return !1;
	    return !0
	}
	function arrayCamelCased(arr){
		try{
		 let newArr = [];
		 for (let i=0; i<arr.length; i++) {
			 let temp = objCamelCased(arr[i]);
			 newArr.push(temp);
		 }
		 return newArr;
	 }catch(e){
		 //TODO handle the exception
		 console.log(e);
		 return "";
	 }
	}

	function objCamelCased(data){
		try{
			let newObj = {};
			for (let key in data) {
				let tempArr = [];
				let tempKey = '';
				key.split("_").forEach(function(value, index, array) {
					if(index > 0) {
						 value = value.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
					}
					tempKey += value;
				})
				newObj[tempKey] = data[key];
			}
			return newObj;
		}catch(e){
			//TODO handle the exception
			console.log(e);
			return "";
		}
	}

module.exports = {
	arrayCamelCased: arrayCamelCased,
	objCamelCased: objCamelCased,
	formatTime:formatTime,
	isEmptyObject:isEmptyObject
}
