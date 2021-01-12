const Notary = artifacts.require('Notary.sol')
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

contract('Notary', accounts => {
    let notary

    let filename = 'Deed'
    let checksum = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    let invalidCheckSum = "0x1be23554545030e1ce47391a41098a46ff426382ed740db62d63d7676ff6fcf1"
    let comments = "Test comment"

    beforeEach(async () => {
        notary = await Notary.new()
    })

    it('should return addresses', async () => {
        const addresses = await web3.eth.getAccounts()
        assert.equal(addresses.length, 10)
    })

    it('should add new entry', async () => {
        const instance = await notary.addEntry(filename, checksum, comments, { from: accounts[0] })

        await expectEvent(instance, 'NewEntry', {
            _checksum: checksum,
            _filename: filename,
            _setBy: accounts[0]
        })
    })

    it('should NOT get non existing entry', async () => {
        await expectRevert(
            notary.entrySet(invalidCheckSum),
            'Non-existing entry!'
        )
    })

    it('should get the entry', async () => {
        await notary.addEntry(filename, checksum, comments, { from: accounts[0] })
        const entry = await notary.entrySet(checksum)

        assert.equal(entry['0'], filename)
        assert.equal(entry['1'], comments)
        assert.equal(entry['2'], accounts[0])
        assert(entry['3'] > 1, 'timestamp should be bigger than 1!')
    })

    it('should NOT set already added entry!', async () => {
        await notary.addEntry(filename, checksum, comments, { from: accounts[0] })

        await expectRevert(
            notary.addEntry('Tax', checksum, 'Tax Report', { from: accounts[1] }),
            'Already set'
        )
    })
})



