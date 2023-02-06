import { beginTransaction, commit, rollback } from '@/config/db_connection';
import { findOne, groupArrObj } from '@/utils/data-tranform';
import { Injectable } from '@nestjs/common';
import { AppModel } from './app.model';
import { CommissionModel } from './commission.model';

@Injectable()
export class AppService {
  constructor(private readonly appModel: AppModel, private commissionMode: CommissionModel) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getDepartmentId(departmentCode) {
    const department = await this.appModel.getDepartmentIdByDepartmentCode(departmentCode)
    if (department.length) {
      const { departmentId } = await findOne(department)
      return departmentId
    } else {
      return false
    }
  }

  async getFactionmentId(factionCode) {
    const faction = await this.appModel.getFactionIdByFactionCode(factionCode)
    if (faction.length) {
      const { factionId } = await findOne(faction)
      return factionId
    } else {
      return false
    }
  }

  async createOrUpdateDepartment(payload) {
    const hasDepartment = await this.appModel.findDepartmentByDepartmentCode(payload.departmentCode)
    if (hasDepartment.length) {
      console.log('update Department')
      await this.appModel.updateDepartment(payload.departmentCode, payload)
    }
    else {
      console.log('create department');

      await this.appModel.createDepartment(payload)
    }
    return true
  }

  async createOrUpdateFaction(payload) {
    const hasFaction = await this.appModel.findFactionByFactionCode(payload.factionCode)
    if (hasFaction.length) {
      console.log('update Faction')
      await this.appModel.updateFaction(payload.factonCode, payload)
    } else {
      console.log('create faction');

      await this.appModel.createFaction(payload)
    }
    return true
  }

  async createOrUpdateSMModel(payload) {
    const hasSMModel = await this.appModel.findSMModelBySMModelCode(payload.smModelCode)
    if (hasSMModel.length) {
      console.log('update SMModel')
      await this.appModel.updateSMModel(payload.smModelCode, payload)
    } else {
      console.log('create sm model');

      await this.appModel.createSMModel(payload)
    }
    return true
  }

  async createOrUpdateDimDepartment(payload) {
    const hasDimDepartment = await this.appModel.findDimDepartmentByDimDepartmentCode(payload.dimDepartmentCode)
    if (hasDimDepartment.length) {
      console.log('update DimDepartment')
      await this.appModel.updateDimDepartment(payload.dimDepartmentCode, payload)
    } else {
      console.log('create dim department');

      await this.appModel.createDimDepartment(payload)
    }
    return true
  }

  async createOrUpdateDimDivision(payload) {
    const hasDimDivision = await this.appModel.findDimDivisionByDimDivisionCode(payload.dimDivisionCode)
    if (hasDimDivision.length) {
      console.log('update DimDivision')
      await this.appModel.updateDimDivision(payload.dimDivisionCode, payload)
    } else {
      console.log('create dim division');

      await this.appModel.createDimDivision(payload)
    }
    return true
  }

  async createOrUpdateDimSubDivision(payload) {
    const hasDimSubDivision = await this.appModel.findDimSubDivisionByDimSubDivisionCode(payload.dimSubDivisionCode)
    if (hasDimSubDivision.length) {
      console.log('update DimSubDivision')
      await this.appModel.updateDimSubDivision(payload.dimSubDivisionCode, payload)
    }
    else {
      console.log('create dim sub division');

      await this.appModel.createDimSubDivision(payload)
    }
    return true
  }

  async createOrUpdateDimEmployeeArea(payload) {
    const hasDimEmployeeArea = await this.appModel.findDimEmployeeAreaByDimEmployeeAreaCode(payload.dimEmployeeAreaCode)
    if (hasDimEmployeeArea.length) {
      console.log('update DimEmployeeArea')
      await this.appModel.updateDimEmployeeArea(payload.dimEmployeeAreaCode, payload)
    } else {
      console.log('create dim emp area');

      await this.appModel.createDimEmployeeArea(payload)
    }
    return true
  }


  async createOrUpdateDimGroup(payload) {
    const hasDimDepartment = await findOne(await this.appModel.findDimDepartmentByDimDepartmentCode(payload.dimDepartment))
    const hasDimDivision = await findOne(await this.appModel.findDimDivisionByDimDivisionCode(payload.dimDivision))
    const hasDimSubDivision = await findOne(await this.appModel.findDimSubDivisionByDimSubDivisionCode(payload.dimSubDivision))
    const hasDimEmployeeArea = await findOne(await this.appModel.findDimEmployeeAreaByDimEmployeeAreaCode(payload.dimEmployeeArea))

    if (Object.keys(hasDimDepartment).length && Object.keys(hasDimDivision).length && Object.keys(hasDimSubDivision).length && Object.keys(hasDimEmployeeArea).length) {
      const payload = {
        dimDepartmentId: hasDimDepartment.dimDepartmentId,
        dimDivisionId: hasDimDivision.dimDivisionId,
        dimSubDivisionId: hasDimSubDivision.dimSubDivisionId,
        dimEmployeeAreaId: hasDimEmployeeArea.dimEmployeeAreaId
      }
      await this.appModel.createDimGroup(payload)
    } else {
      console.log('create dim group failed');

    }
  }

  async createOrUpdateUser(payload) {
    const hasUser = await this.appModel.findUserByUserCode(payload.userCode)
    const department = await findOne(await this.appModel.findDepartmentIdByDepartmentNameTH(payload.departmentId))
    const faction = await findOne(await this.appModel.findFactionIdByFactionNameTH(payload.factionId))
    const smModel = await findOne(await this.appModel.findSMModelIdBySMModelNameTH(payload.smModelId))
    const taModel = await findOne(await this.appModel.findTAModelIdByTAModelNameTH(payload.taModelId))
    if (hasUser.length) {
      console.log('update User')
      // await this.appModel.updateUser(payload.userCode, payload)
    } else {
      console.log('create user');
      payload.departmentId = department ? department.departmentId : null
      payload.factionId = faction ? faction.factionId : null
      payload.smModelId = smModel ? smModel.smModelId : null
      payload.taModelId = taModel ? taModel.taModelId : null
      await this.appModel.createUser(payload)
    }
  }

  async createOrUpdateDimGroupCustomer(payload) {
    const dimGroup = await findOne(await this.appModel.findDimGroupId(payload))
    const customer = await findOne(await this.appModel.findCustomerByD365CustomerCode(payload.d365CustomerCode))

    if (dimGroup && Object.keys(dimGroup).length && customer && Object.keys(customer).length) {
      payload.d365CustomerCode = customer.d365CustomerCode
      payload.dimGroupId = dimGroup.dimGroupId
      payload.customerType = customer.customerType
      payload.createdBy = 'system'
      delete payload.dimDepartment
      delete payload.dimDivision
      delete payload.dimSubDivision
      delete payload.dimEmployeeArea

      await this.appModel.createDimGroupCustomer(payload)
    }
    else {
      console.log('create dim group customer failed');
    }

  }

  async createOrUpdateTAModel(payload) {
    const hasTAModel = await this.appModel.findTAModelByTAModelCode(payload.taModelCode)
    const department = await findOne(await this.appModel.findDepartmentByDepartmentCode(payload.departmentCode))
    const faction = await findOne(await this.appModel.findFactionByFactionCode(payload.factionCode))
    const smModel = await findOne(await this.appModel.findSMModelBySMModelCode(payload.smModelCode))
    if (!hasTAModel.length && department && Object.keys(department).length && faction && Object.keys(faction).length && smModel && Object.keys(smModel).length) {
      delete payload.departmentCode
      delete payload.factionCode
      delete payload.smModelCode
      payload.departmentId = department.departmentId
      payload.factionId = faction.factionId
      payload.smModelId = smModel.smModelId

      console.log(payload);
      console.log('created ta model');

      await this.appModel.createTAModel(payload)
    } else {
      // console.log({hasTAModel, department, faction, smModel, payload});

      console.log('update ta model');
    }
  }

  async getCommissionReport() {
    const result = await this.commissionMode.getCommissionReport()
    for (const item of result) {
      item.IVZS_Quantity = Number(item.Quanity) * Number(item.startingPrice)
      item.orderDiscountBath = Number(item.IVZS_Quantity) - Number(item.LineAmount)
      item.orderDiscountPercent = ((Number(item.LineAmount) / Number(item.IVZS_Quantity)) * 100) - item.DiscountPercent
      item.totalDiscountPercent = Number(item.orderDiscountPercent) + Number(item.DiscountPercent)
      item.productPrice = null
    }
    return result
  }

  async createOrUpdateSaleArea(payload) {
    try {

      // console.log(JSON.stringify(payload, null, 2));
      const smModels = payload.map((item) => item.smModelCode)
      const uniqueSMModels = [...new Set(smModels)]
      const taModels = []
      const data = {}
      for (const item of uniqueSMModels) {
        data[String(item)] = []
        for (const item_2 of payload.filter((sm) => sm.smModelCode === item)) {
          data[String(item)].push(item_2)

        }
      }

      const sale_area: any = {}

      for (const item of uniqueSMModels) {
        await beginTransaction()
        let saleAreaCode = null
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
          saleAreaCode += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        const faction = await findOne(await this.appModel.findFactionByFactionCode(data[String(item)][0].factionCode))
        if (!faction) {
          await rollback()
          continue
        }
        const md = await findOne(await this.appModel.findUserByUserCode(data[String(item)][0].mdCode))
        if (!md) {
          await rollback()
          continue
        }
        sale_area["factionId"] = faction.factionId
        sale_area["userId"] = md.userId
        sale_area["companyName"] = 'ธรรมสรณ์'
        sale_area["saleAreaName"] = null
        sale_area["saleAreaCode"] = saleAreaCode
        // const saleAreaSMUsers = await data[String(item)].map((item) => { return { userId: item.smCode } })
        const saleAreaSMUsers = []
        for (const item_2 of data[String(item)]) {
          const sm = await findOne(await this.appModel.findUserByUserCode(item_2.smCode))
          if (sm) {
            saleAreaSMUsers.push(sm.userId)
          }
        }

        if (!saleAreaSMUsers.length) {
          await rollback()
          continue
        }

        const smModel = await findOne(await this.appModel.findSMModelBySMModelCode(item))
        if (!smModel) {
          await rollback()
          continue
        }
        sale_area["saleAreaSMModel"] = {
          smModelId: smModel.smModelId,
          saleAreaSMUsers
        }

        const sale_area_payload = {
          factionId: sale_area.factionId,
          userId: sale_area.userId,
          companyName: sale_area.companyName,
          saleAreaCode: sale_area.saleAreaCode,
          createdBy: 'system'
        }
        const createdSaleArea = await this.appModel.createSaleArea(sale_area_payload)

        const sa_sm_model_payload = {
          saleAreaId: createdSaleArea.insertId,
          smModelId: sale_area.saleAreaSMModel.smModelId,
          createdBy: 'system'
        }
        const createdSASMModel = await this.appModel.createSaleAreaSMModel(sa_sm_model_payload)

        for (const i of saleAreaSMUsers) {
          const sa_sm_user_payload = {
            saleAreaSMModelId: createdSASMModel.insertId,
            userId: i,
            createdBy: 'system'
          }
          const createdSASMUser = await this.appModel.createSaleAreaSMUser(sa_sm_user_payload)
        }

        const taModels = []
        const taUsers = []
        for (const i of data[String(item)]) {
          const taModel = await findOne(await this.appModel.findTAModelByTAModelCode(i.taModelCode))
          if (!taModel) {
            console.log('not found ta model: ', i.taModelCode);
          } else {
            taModels.push(taModel.taModelId)
            const sale_area_ta_model_payload = {
              saleAreaId: createdSaleArea.insertId,
              taModelId: taModel.taModelId,
              createdBy: 'system',
              //!! saleAreaSMModelId ห้ามลืม!!!!
            }
            const taModelInSaleArea = await this.appModel.findTAModelInSaleArea(i.taModelCode)
            if (!taModelInSaleArea.length) {
              const createdSaleAreaTAModel = await this.appModel.createSaleAreaTAModel(sale_area_ta_model_payload)

              const taUser = await findOne(await this.appModel.findUserByUserCode(i.taCode))
              if (!taUser) {
                console.log('not found ta user: ', i.taCode);
              } else {
                taUsers.push(taUser.userId)
                const sale_area_ta_user_payload = {
                  saleAreaTAModelId: createdSaleAreaTAModel.insertId,
                  userId: taUser.userId,
                  createdBy: 'system'
                }
                const createdSATAUser = await this.appModel.createSATAUser(sale_area_ta_user_payload)
              }
            }
          }
        }
        // const data_structure = {
        //   factionId: null,
        //   userId: null,
        //   saleAreaName: null,
        //   saleAreaSMModel: {},
        //   salAreaTaModels: [],
        // }
        if ((taModels.length && !taUsers.length) || (!taModels.length && taUsers.length) || (!taModels.length && !taUsers.length)) {
          await rollback()
          continue
        }
        // await commit()
        await rollback()
      }
      return data
    } catch (error) {
      await rollback()
      return false
    }
  }

  async createOrUpdateTAModelCustomer(payload) {
    const customer = await findOne(await this.appModel.findCustomerByD365CustomerCode(payload.customerCode))
    if (!payload.taModelCode1) payload.taModelCode = payload.taModelCode2
    else if (!payload.taModelCode2) payload.taModelCode = payload.taModelCode1
    else if (payload.taModelCode1 && payload.taModelCode2) payload.taModelCode = payload.taModelCode1
    else if (!payload.taModelCode1 && !payload.taModelCode2) payload.taModelCode = null
    delete payload.taModelCode1
    delete payload.taModelCode2

    if (customer && payload.taModelCode) {
      payload.customerType = customer.customerType
      const saleAreaTAModel = await findOne(await this.appModel.findTAModelInSaleArea(payload.taModelCode))
      const customerInTAModelCustomer = await findOne(await this.appModel.findCustomerInTAModelCustomer(payload.customerCode))

      if (saleAreaTAModel && !customerInTAModelCustomer) {
        console.log({ saleAreaTAModel })

        delete payload.taModelCode
        payload.saleAreaTAModelId = saleAreaTAModel.saleAreaTAModelId
        payload.createdBy = 'system'
        const createdCustomerInTAModel = await this.appModel.createTAModelCustomer(payload)
      }
    } else {
      console.log('create ta model customer failed');

    }
    return true
  }

  async createOrUpdateTAModelProjectPending(payload) {
    const { employeeCode, projectCode, projectName, taModelCode } = payload
    if (projectCode && projectName) {
      const project = await findOne(await this.appModel.findProjectPendingByProjectCode(projectCode))
      if (!project) {
        const createdProjectPending = await this.appModel.createProjectPending({ employeeCode, projectCode, customerType: 'PROJECT PENDING', projectName, createdBy: employeeCode ? employeeCode : 'system', latitude: 0.00, longitude: 0.00 })
      }
      const saleAreaTAModel = await findOne(await this.appModel.findTAModelInSaleArea(taModelCode))
      const projectInTAModelCustomer = await findOne(await this.appModel.findCustomerInTAModelCustomer(projectCode))
      if (saleAreaTAModel && !projectInTAModelCustomer) {
        const taModelCustomerPayload = {
          saleAreaTAModelId: saleAreaTAModel.saleAreaTAModelId,
          customerCode: projectCode,
          customerType: 'PROJECT PENDING',
          createdBy: 'system'
        }
        const createdCustomerInTAModel = await this.appModel.createTAModelCustomer(taModelCustomerPayload)
      }
    } else {
      console.log(payload);
      console.log('create ta model project pending failed');
    }

  }

  async createOrUpdateProjectContact(payload) {
    const hasCustomer = await findOne(await this.appModel.findCustomerAndAgent(payload.refId))
    const hasProject = await findOne(await this.appModel.findProjectPendingByProjectCode(payload.projectCode))
    const isRelated = await this.appModel.findProjectContact(payload)
    if (hasCustomer && hasProject && !isRelated.length) {
      payload.projectId = hasProject.projectId
      delete payload.projectCode
      payload.createdBy = 'system'
      const createdProjectContact = await this.appModel.createProjectContact(payload)
    } else {
      console.log(payload);
      console.log('create project contact failed');
    }
    return true
  }

  async updateUser(payload) {
    const department = await findOne(await this.appModel.findDepartmentByDepartmentCode(payload.departmentCode))
    console.log('faction: ', payload.factionCode);

    const faction = await findOne(await this.appModel.findFactionByFactionCode(payload.factionCode))
    const hasUser = await findOne(await this.appModel.findUserByUserCode(payload.userCode))
    const smModel = await findOne(await this.appModel.findSMModelBySMModelCode(payload.smModelCode))

    if (hasUser) {
      const { userCode } = payload
      delete payload.userCode
      delete payload.departmentCode
      delete payload.factionCode
      delete payload.smModelCode
      delete payload.taModelCode
      payload.dateStart = payload.dateStart.toISOString().slice(0, 10)

      payload.departmentId = department.departmentId
      payload.factionId = faction.factionId
      payload.smModelId = smModel.smModelId
      payload.email = String(payload.email)
      payload.phone = String(payload.phone)
      payload.updatedBy = 'system'

      delete payload.level
      console.log(`update user ${hasUser.userId}`);
      const updatedUser = await this.appModel.updateTAUser(payload, hasUser.userId)
    } else {
      console.log('not found user', payload.userCode);

    }
  }

  async createOrUpdateCustomerAddresses(payload) {
    const customer = await findOne(await this.appModel.findCustomerAndAgent(payload.customerCode))
    if (customer) {
      const hasCustomerAddress = await findOne(await this.appModel.findCustomerAddress({ customerCode: payload.customerCode, addressType: payload.addressType }))

      if (hasCustomerAddress) {
        console.log(`update ${payload.customerCode}`);

        payload.updatedBy = 'system'
        const updatedCustomerAddress = await this.appModel.updateCustomerAddress(payload.customerCode, payload)
      } else {
        // console.log({hasCustomerAddress});

        console.log('create', payload.customerCode);

        payload.createdBy = 'system'
        const createdCustomerAddress = await this.appModel.createCustomerAddress(payload)
      }
    } else {
      console.log(`customer not found: ${payload.customerCode}`);

    }

  }

  async updateRuningNumber(filter) {
    return await this.appModel.updateRuningNumber(filter)
  }

  async findLastRunningNumber(filter) {
    return await this.appModel.findLastRunningNumber(filter)
  }

  async createOrUpdateOldProjectPending(payload) {
    // const saleAreaTAModel = await findOne(this.appModel.findSaleAreaTAModelIdByUserCode(payload.employeeCode))
    let saleAreaTAModel = await this.appModel.findSaleAreaTAModelIdByUserCode(payload.employeeCode)
    if (saleAreaTAModel.length) {
      const { saleAreaTAModelId } = await findOne(saleAreaTAModel)
      await this.appModel.createProjectPending(payload)
      const ta_model_customer = {
        customerCode: payload.projectCode,
        customerType: 'PROJECT PENDING',
        saleAreaTAModelId,
        createdBy: payload.employeeCode
      }

      await this.appModel.createTAModelCustomer(ta_model_customer)
      return { foundSaleArea: payload.employeeCode }
    } else {
      return { notFoundSaleArea: payload.employeeCode }
    }
  }

}


