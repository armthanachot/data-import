import { query } from "@/config/db_connection";

export class AppModel {
    async getDepartmentIdByDepartmentCode(departmentCode) {
        const result = await query(`SELECT departmentId FROM departments WHERE departmentCode = ?`, [departmentCode])
        return result
    }
    async getFactionIdByFactionCode(factionCode) {
        const result = await query(`SELECT factionId FROM factions WHERE factionCode = ?`, [factionCode])
        return result
    }
    async findDepartmentByDepartmentCode(departmentCode) {
        const result = await query(`SELECT departmentId,departmentCode FROM departments WHERE departmentCode = ? OR departmentNameTH = ? OR departmentNameEN = ?`, [departmentCode, departmentCode, departmentCode])
        return result
    }
    async findFactionByFactionCode(factionCode) {
        const result = await query(`SELECT factionId, factionCode FROM factions WHERE factionCode = ? OR factionNameTH = ? OR factionNameEN = ?`, [factionCode, factionCode, factionCode])
        return result
    }
    async findSMModelBySMModelCode(smModelCode) {
        const result = await query(`SELECT smModelId, smModelCode FROM sm_models WHERE smModelCode = ? OR smModelNameTH = ? OR smModelNameEN = ?`, [smModelCode, smModelCode, smModelCode])
        return result
    }
    async findDimDepartmentByDimDepartmentCode(dimDepartmentCode) {
        const result = await query(`SELECT dimDepartmentId, dimDepartmentCode FROM dim_departments WHERE dimDepartmentCode = ?`, [dimDepartmentCode])
        return result
    }
    async findDimDivisionByDimDivisionCode(dimDivisionCode) {
        const result = await query(`SELECT dimDivisionId, dimDivisionCode FROM dim_divisions WHERE dimDivisionCode = ?`, [dimDivisionCode])
        return result
    }
    async findDimSubDivisionByDimSubDivisionCode(dimSubDivisionCode) {
        const result = await query(`SELECT dimSubDivisionId, dimSubDivisionCode FROM dim_sub_divisions WHERE dimSubDivisionCode = ?`, [dimSubDivisionCode])
        return result
    }
    async findDimEmployeeAreaByDimEmployeeAreaCode(dimEmployeeAreaCode) {
        const result = await query(`SELECT dimEmployeeAreaId, dimEmployeeAreaCode FROM dim_employee_areas WHERE dimEmployeeAreaCode = ?`, [dimEmployeeAreaCode])
        return result
    }
    async findDepartmentIdByDepartmentNameTH(departmentNameTH) {
        const result = await query(`SELECT departmentId FROM departments WHERE departmentNameTH = ?`, [departmentNameTH])
        return result
    }
    async findFactionIdByFactionNameTH(factionNameTH) {
        const result = await query(`SELECT factionId FROM factions WHERE factionNameTH = ?`, [factionNameTH])
        return result
    }
    async findSMModelIdBySMModelNameTH(smModelNameTH) {
        const result = await query(`SELECT smModelId FROM sm_models WHERE smModelNameTH = ?`, [smModelNameTH])
        return result
    }
    async findTAModelIdByTAModelNameTH(taModelNameTH) {
        const result = await query(`SELECT taModelId FROM ta_models WHERE taModelNameTH = ?`, [taModelNameTH])
        return result
    }
    async findUserByUserCode(userCode) {
        const result = await query(`SELECT userId FROM users WHERE userCode = ?`, [userCode])
        return result
    }
    async findCustomerByD365CustomerCode(customerCode) {
        const result = await query(`
        SELECT customerCode,d365CustomerCode, customerType FROM customers WHERE d365CustomerCode = ?
        UNION 
        SELECT agentCode,d365CustomerCode, customerType FROM agents WHERE d365CustomerCode = ?
        `, [customerCode, customerCode])
        return result
    }
    async findDimGroupId({ dimDepartment, dimDivision, dimSubDivision, dimEmployeeArea }) {
        const result = await query(`SELECT dimGroupId FROM dim_groups WHERE dimDepartmentId = (select dimDepartmentId FROM dim_departments where dimDepartmentCode = ?) AND dimDivisionId = (select dimDivisionId FROM dim_divisions where dimDivisionCode = ?) AND dimSubDivisionId = (select dimSubDivisionId from dim_sub_divisions where dimSubDivisionCode = ?) AND dimEmployeeAreaId = (select dimEmployeeAreaId from dim_employee_areas where dimEmployeeAreaCode = ?)`, [dimDepartment, dimDivision, dimSubDivision, dimEmployeeArea])
        return result
    }
    async findTAModelByTAModelCode(taModelCode) {
        const result = await query(`SELECT taModelId FROM ta_models WHERE taModelCode = ?`, [taModelCode])
        return result
    }
    async findTAModelInSaleArea(taModelCode) {
        const result = await query(`SELECT saleAreaTAModelId, taModelId FROM sale_area_ta_models WHERE taModelId = (SELECT taModelId FROM ta_models WHERE taModelCode = ?)`, [taModelCode])
        return result
    }
    async findCustomerInTAModelCustomer(customerCode) {
        const result = await query(`SELECT taModelCustomerId FROM ta_model_customers WHERE customerCode = ?`, [customerCode])
        return result
    }
    async findProjectPendingByProjectCode(projectCode) {
        const result = await query(`SELECT projectId FROM projects WHERE projectCode = ?`, [projectCode])
        return result
    }
    async findCustomerAndAgent(refId) {
        const result = await query(`
        SELECT customerId,customerCode,d365CustomerCode, customerType FROM customers WHERE customerCode = ?
        UNION 
        SELECT agentId,agentCode,d365CustomerCode, customerType FROM agents WHERE agentCode = ?
        `, [refId, refId])
        return result
    }
    async findProjectContact({ projectCode, refId }) {
        const result = await query(`SELECT projectContactId FROM project_contacts WHERE projectId = (SELECT projectId FROM projects WHERE projectCode = ?) AND refId = ?`, [projectCode, refId])
        return result
    }
    async findCustomerAddress({ customerCode, addressType }) {
        console.log({ customerCode, addressType });
        const result = await query(`SELECT customerAddressId FROM customer_addresses WHERE customerCode = ? AND addressType = ?`, [customerCode, addressType])
        console.log(result);

        return result
    }
    async createDepartment(payload) {
        const result = await query(`INSERT INTO departments SET ?`, [payload])
        return result
    }
    async createFaction(payload) {
        const result = await query(`INSERT INTO factions SET ?`, [payload])
        return result
    }
    async createSMModel(payload) {
        const result = await query(`INSERT INTO sm_models SET ?`, [payload])
        return result
    }
    async createDimDepartment(payload) {
        const result = await query(`INSERT INTO dim_departments SET ?`, [payload])
        return result
    }
    async createDimDivision(payload) {
        const result = await query(`INSERT INTO dim_divisions SET ?`, [payload])
        return result
    }
    async createDimSubDivision(payload) {
        const result = await query(`INSERT INTO dim_sub_divisions SET ?`, [payload])
        return result
    }
    async createDimEmployeeArea(payload) {
        const result = await query(`INSERT INTO dim_employee_areas SET ?`, [payload])
        return result
    }
    async createDimGroup(payload) {
        const result = await query(`INSERT INTO dim_groups SET ?`, [payload])
        return result
    }
    async createUser(payload) {
        const result = await query(`INSERT INTO users SET ?`, [payload])
        return result
    }
    async createDimGroupCustomer(payload) {
        const result = await query(`INSERT INTO dim_group_customers SET ?`, [payload])
        return result
    }
    async createTAModelCustomer(payload) {
        const result = await query(`INSERT INTO ta_model_customers SET ?`, [payload])
        return result
    }
    async createTAModel(payload) {
        const result = await query(`INSERT INTO ta_models SET ?`, [payload])
        return result
    }
    async createProjectPending(payload) {
        const result = await query(`INSERT INTO projects SET ?`, [payload])
        return result
    }
    async createCustomerAddress(payload) {
        const result = await query(`INSERT INTO customer_addresses SET ?`, [payload])
        return result
    }
    async updateDepartment(ref, payload) {
        const result = await query(`UPDATE departments SET ? WHERE departmentCode = ?`, [payload, ref])
        return result
    }
    async updateFaction(ref, payload) {
        const result = await query(`UPDATE factions SET ? WHERE factionCode = ?`, [payload, ref])
        return result
    }
    async updateSMModel(ref, payload) {
        const result = await query(`UPDATE sm_models SET ? WHERE smModelCode = ?`, [payload, ref])
        return result
    }
    async updateDimDepartment(ref, payload) {
        const result = await query(`UPDATE dim_departments SET ? WHERE dimDepartmentCode = ?`, [payload, ref])
        return result
    }
    async updateDimDivision(ref, payload) {
        const result = await query(`UPDATE dim_divisions SET ? WHERE dimDivisionCode = ?`, [payload, ref])
        return result
    }
    async updateDimSubDivision(ref, payload) {
        const result = await query(`UPDATE dim_sub_divisions SET ? WHERE dimSubDivisionCode = ?`, [payload, ref])
        return result
    }
    async updateDimEmployeeArea(ref, payload) {
        const result = await query(`UPDATE dim_employee_areas SET ? WHERE dimEmployeeAreaCode = ?`, [payload, ref])
        return result
    }
    async updateUser(ref, payload) {
        const result = await query(`UPDATE users SET ? WHERE userCode = ?`, [payload, ref])
        return result
    }

    async updateTAUser(payload, userId) {
        const result = await query('UPDATE users SET ? WHERE userId = ?', [payload, userId])
        return result
    }
    async updateCustomerAddress(ref, payload) {
        const result = await query(`UPDATE customer_addresses SET ? WHERE customerCode = ?`, [payload, ref])
        return result
    }

    async updateRuningNumber({ prefixType }) {
        const result = await query(`UPDATE prefix_running_number SET  runningNumber = runningNumber + 1 WHERE prefixType = ?`, prefixType)
        return result
    }

    async findLastRunningNumber({ prefixType }) {
        return await query(`SELECT runningNumber FROM prefix_running_number WHERE prefixType = ?`, [prefixType])
    }

    async findSaleAreaTAModelIdByUserCode(userCode) {
        return await query(`SELECT saleAreaTAModelId FROM sale_area_ta_users WHERE userId = (SELECT userId FROM users WHERE userCode = ?) LIMIT 1`,[userCode])
    }
    async commissionReport() {
        const result = await query(`SELECT InvoiceNo, SalesOrder, InvoiceDate`)
        return result
    }

    async createSaleArea(payload) {
        const result = await query(`INSERT INTO sale_areas SET ?`, [payload])
        return result
    }

    async createSaleAreaSMModel(payload) {
        const result = await query(`INSERT INTO sale_area_sm_models SET ?`, [payload])
        return result
    }

    async createSaleAreaSMUser(payload) {
        const result = await query(`INSERT INTO sale_area_sm_users SET ?`, [payload])
        return result
    }
    async createSaleAreaTAModel(payload) {
        const result = await query(`INSERT INTO sale_area_ta_models SET ?`, [payload])
        return result
    }
    async createSATAUser(payload) {
        const result = await query(`INSERT INTO sale_area_ta_users SET ?`, [payload])
        return result
    }
    async createProjectContact(payload) {
        const result = await query(`INSERT INTO project_contacts SET ?`, [payload])
        return result
    }
}