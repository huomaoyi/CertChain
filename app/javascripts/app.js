// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../stylesheets/main/main.css";
import "../stylesheets/main/style.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var certUsers;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setStatus2: function(message) {
    var status = document.getElementById("add_status");
    status.innerHTML = message;
  },
  setStatus3: function(message) {
    var status = document.getElementById("status3");
    status.innerHTML = message;
  },
  getCertUserFirst: function() {
    var self = this;
   // this.setStatus3("getCertUserFirst ......");
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getCertUserFirst({from: account});
    }).then(function(username) {
       var a = document.getElementById("status3");
	  a.innerHTML=username;
	  console.log(username);
    }).catch(function(e) {
      console.log(e);
	   var a = document.getElementById("status3");
	  a.innerHTML="Error; see log.";
    });
  },
//	添加CA
   addCA:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;
	document.getElementById("ca_status").innerHTML= "Initiating transaction... (please wait)";

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.addCA(receiver,{from: account});
    }).then(function(data, istrue) {   //返回的数据怎么解析？？？所有的返回值都解析不了
		/*if(istrue) {
			document.getElementById("ca_status").innerHTML= data + "---add success";
		} else {
			document.getElementById("ca_status").innerHTML= data + "---add fail";
		}*/
		document.getElementById("ca_status").innerHTML= data + "---add success";
       console.log("addCA" + data);
    }).catch(function(e) {
      console.log(e);
       document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },
//	获取CA
   getCAByAddress:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;
	document.getElementById("ca_status").innerHTML= "Initiating transaction... (please wait)";

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getCAByAddress(receiver,{from: account});
    }).then(function(data) {
		document.getElementById("ca_status").innerHTML= data + "---get success";
       console.log(data);
    }).catch(function(e) {
      console.log(e);
       document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },
  //删除CA
   deleteCA:function() {
    var self = this;
    var meta;
	var receiver = document.getElementById("add_CAAddress").value;
	document.getElementById("ca_status").innerHTML= "Initiating transaction... (please wait)";

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.deleteCA(receiver,{from: account});
    }).then(function(data) {
		document.getElementById("ca_status").innerHTML= data + "---delete success";
       console.log(data);
    }).catch(function(e) {
      console.log(e);
       document.getElementById("ca_status").innerHTML= "error. see log";
    });
  },


//添加证书
  createCertUser: function() {
    var self = this;
    var username = document.getElementById("username").value;
    var identityId = document.getElementById("identityId").value;
    var certnumber = document.getElementById("certnumber").value;
    var orgname = document.getElementById("orgname").value;
    var hashstr = document.getElementById("hashstr").value;
    var useraddress = document.getElementById("useraddress").value;
    var CA = document.getElementById("CA").value;
    var CAAddress = document.getElementById("CAAddress").value;

    this.setStatus2("Initiating createCertUser transaction... (please wait)");
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.createCertUser(username, identityId, certnumber, orgname, hashstr, useraddress, CA, CAAddress, {from: account});
    }).then(function(data) {
		console.log(data);// 还是获取不到data
		 self.setStatus2(" CertUser Transaction finished:     " + data);
    }).catch(function(e) {
      console.log(e);
      self.setStatus2("Error createCertUser; see log.");
    });
  },

// 验证证书有效
  verrifyCertUser:function() {
	var self = this;
	var meta;
	var identityId = document.getElementById("verify_identityId").value;
	var certnumber = document.getElementById("verify_certnumber").value;
	var isValid = document.getElementById("verify_status");
	isValid.innerHTML = "wait！！！";
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.verifyCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
		isValid.innerHTML = index;
		console.log(index);
    }).catch(function(e) {
      console.log(e);
      isValid.innerHTML = "Error verify; see log.";
    });

  },
  // 获取用户的第一个证书
  getFirstCertUser:function() {
	var self = this;
	var meta;
	var identityId = document.getElementById("verify_identityId").value;
	var certnumber = document.getElementById("verify_certnumber").value;
	var isValid = document.getElementById("verify_status");
	isValid.innerHTML = "wait！！！";
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getFirstCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
		isValid.innerHTML = index;
		console.log(index);
    }).catch(function(e) {
      console.log(e);
      isValid.innerHTML="Error verify; see log.";
    });
  },

// 列出某用户的所有证书   certUsers
  getAllCertUsers:function() {
    var self = this;
	var meta;
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getAllCertUsers({from: account});
    }).then(function(list) { // 返回string[]  cernumber + ":" + orgname + ":" + userstate + ":" + identityId;
		var innerHtml =
			'<tr><td>20180604</td>&emsp;<td>火毛依团队</td>&emsp;<td><button id="CertUserState" onclick="App.changeCertUserState()">正常</button></td></tr><br/>'
	      + '<tr><td>20180604</td>&emsp;<td>火毛依团队</td>&emsp;<td><button id="CertUserState" onclick="App.changeCertUserState()">锁定</button></td></tr><br/>'
	      + '<tr><td>20180604</td>&emsp;<td>火毛依团队</td>&emsp;<td><button id="CertUserState" onclick="App.changeCertUserState()">已失效</button></td></tr><br/>';
		//这里的<tr>在最后没有生效，不知道为啥
		console.log("return" + list);
		for(var i = 0; i < list.length; i++) {
			var array = new Array();
			array = list[i].split(":");
			var state;
			if(array[2].valueOf() == 0) state = "正常";
			else if(array[2].valueOf() == 1) state = "锁定";
			else if(array[2].valueOf() == 2) state = "已失效";
			innerHtml +=  '<tr id=tr' + i.valueOf() +'><td>'+ array[0]+'</td><td>'+ array[1] +'</td><td><button id="CertUserState' + i.valueOf()
						+'" onclick="App.changeCertUserState()">'+ state +'</button></td></tr>';   //TO DO 参数要怎么传？
		}
		document.getElementById("listDetails").innerHTML = innerHtml;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error ; see log.");
    });
  },

  // 列出用户的第一个证书，可改变状态
  listFirstCertUser:function() {
	var self = this;
	var meta;
	var identityId = document.getElementById("listall_identityId").value;
	var certnumber = document.getElementById("listall_certnumber").value;
	var isValid = document.getElementById("listDetails");
	var innerHtml="";
	isValid.innerHTML = "wait！！！";
	var count =0;
	while(count++  < 4){
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getFirstCertUser(identityId, certnumber, {from: account});
    }).then(function(index) {
		var state;
		var i = 1;
		if(index[8].valueOf() == 0) state = "正常";
		else if(index[8].valueOf() == 1) state = "已锁定";
		else if(index[8].valueOf() == 2) state = "已失效";
		innerHtml += index[0]+ '&emsp;' + index[3] + '&emsp;' + '<button onclick="App.changeCertUserState(1)">' +state +'</button><br/>';
		isValid.innerHTML = innerHtml;
		console.log(index);
    }).catch(function(e) {
      console.log(e);
      document.getElementById("listDetails").innerHTML="Error verify; see log.";
    });
	}
  },

  // 改变证书状态
  changeCertUserState:function(state) {
    var self = this;
	var meta;
	document.getElementById("list_status").innerHTML="----------wait";
	var identityId = document.getElementById("listall_identityId").value;
	var certnumber = document.getElementById("listall_certnumber").value;
	MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.changeCertUserState(identityId, certnumber, state, {from: account});
    }).then(function(data) {
		console.log(data);
		document.getElementById("list_status").innerHTML="result of change state" + data;
    }).catch(function(e) {
      console.log(e);
      document.getElementById("list_status").innerHTML=="Error; see log.";
    });
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },


  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }


};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
