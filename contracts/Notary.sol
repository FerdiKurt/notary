// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.8.0;

contract Notary {
    struct NotaryEntry {
        string filename;
        bytes32 checksum;
        string comments;
        uint timestamp;
        bool isSet;
        address setBy;
    }

    mapping(bytes32 => NotaryEntry) notaries;

    event NewEntry(bytes32 _checksum, string _filename, address indexed _setBy);

    function addEntry(
        string memory _filename,
        bytes32 _checksum,
        string memory _comments
    ) public {
        
        require(notaries[_checksum].isSet == false, "Already set");

        notaries[_checksum] = NotaryEntry(
            _filename,
            _checksum,
            _comments,
            block.timestamp,
            true,
            msg.sender
        );

        emit NewEntry(_checksum, _filename, msg.sender);
    }

    function entrySet(bytes32 _checksum) 
        public 
        view 
        returns (string memory, string memory, address, uint) 
    {
        require(notaries[_checksum].isSet == true, "Non-existing entry!");
        
        return( 
            notaries[_checksum].filename,
            notaries[_checksum].comments,
            notaries[_checksum].setBy,
            notaries[_checksum].timestamp
        );
    }
}
