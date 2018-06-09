pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

import "./ConvertLib.sol";
import "./ownable.sol";
import "./safemath.sol";

contract MetaCoin is Ownable{

	 //using SafeMath for uint256;
	address ownerOfContract = 0x627306090abab3a6e1400e9345bc60c78a8bef57;   //不是迅雷链
	uint nullIndex = uint(-1);
	uint cooldownTime = 1 minutes;  //修改证书状态的冷却时间：CA修改无冷却
	// 防重入
	bool locked;
    modifier noReentrancy() {
        if(locked) throw;
        locked = true;
        _;
        locked = false;
    }

	//-------------------------------------------------------------------------------
		mapping (address => uint) balances;

		event Transfer(address indexed _from, address indexed _to, uint256 _value);

		function MetaCoin() public {

			balances[tx.origin] = 100000;
			CAs.push(ownerOfContract);
		}

		function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		Transfer(msg.sender, receiver, amount);
		return true;
	}

		function getBalanceInEth(address addr) public view returns(uint){
			return ConvertLib.convert(getBalance(addr),2);
		}

		function getBalance(address addr) public view returns(uint) {
			return balances[addr];
		}

		function getCertUserFirst() public view returns(string){
			return certusers[0].CA;
		}


	//-------------------------------------------------------------------------------
	struct CertUser {
				string username;   // 姓名：王二
				string identityId;  //身份证号
				string certnumber; //证书编号
				string orgname;  //团队名称：火毛依
				string hashstr;   //
				address useraddress; // 王二的地址
				string CA;  // 发证机构 ： 人民政府
				address CAAddress;
				uint userstate; // 0   1  锁定   2失效
				uint readyTime;
		}
		uint constant maxNum = 10;
		CertUser[] public certusers;    //  证书数组   长度有限吗，可能越界吗？

		//mapping (string => address) mapToCA; // 人民政府 => 政府地址
		//mapping (address => CertUser[]) mapToCertusers;   // 政府地址下的所有证书
		//mapping (string  => address) mapToCAByCertnumber;

		//function MetaCoin() public {
		//	transferOwnership(ownerOfContract);
		//}


		  //合约拥有着设置CA和取消CA       数组的新增和删除返回的数据索引都无法获得
		  // CA 操作
		  address[] public CAs;
		  function addCA(address CAAddress) public payable returns (uint CAIndex, bool error){
			 require(msg.sender == ownerOfContract);
			 if(getCAByAddress(CAAddress) != nullIndex) {
				 return (nullIndex, false);
			 }
			 return (CAs.push(CAAddress),true);
		  }

		  function getCAByAddress(address CAAddress) public view returns (uint CAIndex) {
			  require(CAAddress != 0x0);
			  for(uint i = 0; i < CAs.length; i++ ) {
				 if(CAs[i] == CAAddress) {
					 return i;
				 }
			 }
			 return nullIndex;
		 }
		 function deleteCA(address CAAddress) public payable returns (uint CAIndex) {
			uint index = getCAByAddress(CAAddress);
			if(index != nullIndex) {
				for(uint i = index + 1; i < CAs.length; i++) {
					CAs[i - 1] = CAs[i];
				}
				CAs[CAs.length - 1] = 0x0;
				CAs.length--;
			}
			return index;   // CA存在与否都能删除成功
		}




		//创建证书， 可以创建成功
		function createCertUser(string _username, string _identityId, string _certnumber, string _orgname, string _hashstr
		, address _useraddress, string _CA, address _CAAddress) public payable returns(string)  {
			require(_useraddress != 0x0);
			require(_CAAddress != 0x0);
			uint i =1;
			if(getCAByAddress(_CAAddress) == nullIndex) {
				return "please add to CA to white list first.";
			}
			uint index = _getUniqueCertUserPos(_identityId, _certnumber);
			if(index != nullIndex) {
				return  "add false. the CertUser exists";
			}
			uint certUserIndex = certusers.push(CertUser({username:"aaa", identityId:_identityId, certnumber:_certnumber, orgname:_orgname
			, hashstr:_hashstr,useraddress: _useraddress, CA:_CA, CAAddress:_CAAddress, userstate:0, readyTime:now}));
			return "add success";
		}

		//获取证书数组
		function _getCertuses() private view returns (CertUser[]) {
			return certusers;
		}

		//获取指定证书索引
		function _getUniqueCertUserPos(string identityId, string certnumber) private view returns (uint) {
			CertUser[] memory allCertusers = _getCertuses();
			for(uint i = 0; i < allCertusers.length; i++) {
				if(keccak256(allCertusers[i].identityId) == keccak256(identityId)
					&& keccak256(allCertusers[i].certnumber) == keccak256(certnumber)) {   //TO DO 字符串相等如何处理
					return i;
				}
			}
			return nullIndex;
		}


		// 获取用户的所有证书
		function getAllCertUsers() public view returns (string) {
//			CertUser[] memory certUsers = _getCertuses();
//			string[] memory rtn;
//			uint num = 0;
//			for(uint i = 0; i < certUsers.length; i++) {
//				if(certUsers[i].useraddress == msg.sender) {
//					//rtn[num++] = certUsers[i].certnumber + ":" + certUsers[i].orgname + ":" + certUsers[i].userstate + ":" + certUsers[i].identityId;
//					//字符串拼接有问题,先注释掉
//					rtn[num++] = _stringMerge(_stringMerge(certUsers[i].certnumber,certUsers[i].orgname),certUsers[i].identityId);
//				}
//			}
			return _stringMerge("aa","bb");
		}

		// sha3(s1) == sha3(s2) sha3(s1,s2) == sha3(s1,s2,s3,s4)
		function _stringEquals(string s1, string s2) private pure returns (bool istrue) {
			if(bytes(s1).length != bytes(s2).length) return false;
			for(uint i = 0; i < bytes(s1).length; i++) {
				if(bytes(s1)[i] != bytes(s2)[i])
					return false;
			}
			return true;
		}
		// 变长的storage数组和bytes（不包括string）有一个push()方法。可以将一个新元素附加到数组末端，返回值为当前长度。
		// 123  uint8  memory数组长度必须固定，storate才可调整
		function _stringMerge(string s1, string s2) private pure returns (string) {
			//byte8 fixedLengthBytesArray = 0x1122334455667788;
			//if(bytes(s1).length == 0) return s2;    == 不能用？
			//if(bytes[s2].length == 0) return s1;
			bytes memory rtn = new bytes(bytes(s1).length + bytes(s2).length);
			for(uint i = 0; i < bytes(s1).length; i++) {
				rtn[i] = bytes(s1)[i];
			}
			for(uint j = 0; j < bytes(s2).length; j++) {
				rtn[bytes(s1).length + j] = bytes(s2)[j];
			}
			return string(rtn);
		}

		function verifyCertUser(string identityId, string certnumber) public view returns (bool istrue) {
			for(uint i = 0; i < certusers.length; i++) {
				if(_stringEquals(certusers[i].identityId,identityId) && _stringEquals(certusers[i].certnumber,certnumber)
				&& certusers[i].userstate == 0)
					return true;
			}

			return false;
		}
		// 王二 和人民政府可以获取证书
		function getFirstCertUser(string identityId, string certnumber) public view returns
		(string username, string identityId1, string certnumber1, string orgname, string hashstr
		, address useraddress1, string CA, address CAAddress,uint32 userstate, uint32 readyTime) {
			//命名为index，会报DeclarationError: Identifier already declared，和下面声明冲突

			CertUser[] memory allCertusers = _getCertuses();
			uint index = _getUniqueCertUserPos(identityId, certnumber);
			require(index != nullIndex);
			require(allCertusers[index].useraddress == msg.sender || allCertusers[index].CAAddress == msg.sender);
			return (allCertusers[index].username, allCertusers[index].identityId, allCertusers[index].certnumber, allCertusers[index].orgname
				, allCertusers[index].hashstr, allCertusers[index].useraddress, allCertusers[index].CA, allCertusers[index].CAAddress
				, uint32(allCertusers[index].userstate), uint32(allCertusers[index].readyTime));

		}
		//报错，返回的是个tuple，solidity不支持该类型。 只有内部的函数可以返回struct
		/*function getFirstCertUser1(string identityId, string certnumber) public view returns (CertUser) {
			CertUser[] memory allCertusers = _getCertuses();
			uint index = _getUniqueCertUserPos(identityId, certnumber);
			require(index != nullIndex);
			require(allCertusers[index].useraddress == msg.sender || allCertusers[index].CAAddress == msg.sender);
			return allCertusers[index];

		}*/

		function getCertUserOrgname(string identityId, string certnumber) public view returns (string) {
			uint index = _getUniqueCertUserPos(identityId, certnumber);
			if(index == nullIndex) {
				return "不存在";
			}
			return certusers[index].orgname;
		}

		//改变证书状态
		function changeCertUserState(string identityId, string certnumber, uint state) public payable returns (bool isChanged) {
			CertUser storage certUser = certusers[_getUniqueCertUserPos(identityId, certnumber)];
			require(certUser.userstate != state);
			if(certUser.userstate == 2 ) {
				require(certUser.CAAddress == msg.sender);
				certUser.userstate = state;
			} else {
				//require(_isReady(certUser));   //冷却时间
				certUser.userstate = state;
			}

			_triggerCooldown(certUser);
		}

		 function _triggerCooldown(CertUser storage certUser) internal {
			certUser.readyTime = uint32(now + cooldownTime);
		  }

		  function _isReady(CertUser storage certUser) internal view returns (bool) {
			  return (certUser.readyTime <= now);
		  }

}
