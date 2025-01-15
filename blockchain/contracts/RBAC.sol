pragma solidity ^0.8.0;

contract RBAC {
    struct Log {
        string action;
        address user;
        string role;
        uint256 timestamp;
    }

Log[] public logs;

function addLog(string memory _action, string memory _role) public {
    logs.push(Log({
        action: _action,
        user: msg.sender,
        role: _role,
        timestamp: block.timestamp
    }));
}

function getLog(uint256 index) public view returns (string memory, address, string memory, uint256) {
    require(index < logs.length, "Invalid index");
    Log storage log = logs[index];
    return (log.action, log.user, log.role, log.timestamp);
}

function getLogsCount() public view returns (uint256) {
        return logs.length;
    }
}
