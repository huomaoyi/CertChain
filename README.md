# CertChain数字证书

0. vim truffle.js(将ip更改为自己的ip)
1. truffle compile
2. truffle migrate --reset
3. npm run dev

#####注意事项：
1. 合约发布默认添加了 0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95 作为CA 机构
2. 默认添加了3个证书，identityId 及 certnumber 分别为11,11；22,22；33,33；用户地址及CA地址均为0x6b5344B29E8E7e8e63f61321838f590fF9e7fB95
3. 规则
	1. 证书的CAAddress必须有效，证书才能添加成功
	2. 证书的所有者及CA机构可以查看自己的证书详情，其他用户仅可验证证书是否有效
	3. 当证书被锁定，任何人（包括证书所有者，CA）都无法验证证书真伪
	4. 证书所有者可以将证书锁定或解锁，CA可以将证书锁定，解锁或过期；当证书过期，只有CA可以解除过期状态