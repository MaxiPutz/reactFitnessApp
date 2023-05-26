'use strict'
const Fun = function (props) {
    this.state = 'hello'


    this.setState = () => {
        this.state = 'drei'
    }

}

const Fun2 = (props) => {
    this.x = 'hello'

    return this
}
Fun.prototype.toString = () => 'overrifde' 

