import { findOne } from "./data-tranform"

const CUSTOMER_CODE_PREFIX = {
    "PROJECT OWNER": "M",
    TECHNICIANS: "D",
    CONTRACTOR: "C",
    "PROJECT PENDING": "P",
    AGENT: "A"
  
  }

const generateCstmCode = async (customerType, running) => {
    const prefix = CUSTOMER_CODE_PREFIX[customerType]
    let postfix = ""
    if (!running.length) postfix = String(1).padStart(6, '0')
    else {
        const { runningNumber } = await findOne(running)
        postfix = runningNumber ? String(runningNumber).padStart(6, '0') : String(1).padStart(6, '0')
    }
    const customer_code = prefix + postfix
    return customer_code
}

export {
    generateCstmCode
}
