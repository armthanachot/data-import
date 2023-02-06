/*
 * Copyright (C) 2020 Depwhite Software
 *
 * This file is part of the Depwhite Software project.
 *
 * Depwhite Software project can not be copied and/or distributed without the express
 */

"use strict"

import * as mysql from 'mysql'
import { promisify } from 'util'
import { MYSQL } from './app_config'
import * as path from 'path'
import * as fs from 'fs'

// MYSQL
let dbConfig
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    dbConfig = {
        host: MYSQL.host,
        user: MYSQL.user,
        password: MYSQL.password,
        database: MYSQL.database,
        debug: MYSQL.debug,
        timezone: 'UTC'
    }
}
else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    dbConfig = {
        host: MYSQL.host,
        user: MYSQL.user,
        password: MYSQL.password,
        database: MYSQL.database,
        debug: MYSQL.debug,
        timezone: 'UTC',
        ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, '../config/BaltimoreCyberTrustRoot.crt.pem'))
        }
    }
}

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool)
const escape = mysql.escape
const end = pool.end
const beginTransaction = async () => {
    return await query('START TRANSACTION')
}
const commit = async () => {
    return await query('COMMIT')

}
const rollback = async () => {
    return await query('ROLLBACK')
}
export {
    query,
    escape,
    beginTransaction,
    commit,
    rollback
}













