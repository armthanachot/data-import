import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { MYSQL } from 'config/app_config';
import { Request, Response } from "express";
import { AppService } from './app.service';
import * as Exceljs from 'exceljs'
import { beginTransaction, commit, rollback } from '@/config/db_connection';
import { passwordHash } from '@/utils/security';
import { generateCstmCode } from '@/utils/app';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/master-data')
  async importMasterData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/data_master.xlsx')
      let index = 0
      await beginTransaction()
      // data.workSheets = [{name:'ข้อมูลแผนก'},{name:''},{name:''}]
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name

        if (sheetName === 'ข้อมูลแผนก') {
          // console.log(workSheet.actualRowCount); //get row count
          // row start from 1
          //start from 2 because 1 is column name
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              departmentCode: null,
              departmentNameTH: null,
              departmentNameEN: null
            }
            const keys = Object.keys(payload) // [departmentCode, departmentNameTH, departmentNameEN] 0,1,2
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDepartment(payload)
          }
        } else if (sheetName === 'ข้อมูลฝ่าย') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              departmentId: null,
              factionCode: null,
              factionNameTH: null,
              factionNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              if (keys[j - 2] === 'departmentId') {
                payload[keys[j - 2]] = await this.appService.getDepartmentId(data)
              } else {
                payload[keys[j - 2]] = data
              }
            }
            await this.appService.createOrUpdateFaction(payload)
          }
        } else if (sheetName === 'ข้อมูลเขต ผจส.') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              departmentId: null,
              factionId: null,
              smModelCode: null,
              smModelNameTH: null,
              smModelNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              if (keys[j - 2] === 'departmentId') {
                payload[keys[j - 2]] = await this.appService.getDepartmentId(data)
              }
              else if (keys[j - 2] === 'factionId') {
                payload[keys[j - 2]] = await this.appService.getFactionmentId(data)
              }
              else {
                payload[keys[j - 2]] = data
              }
            }
            await this.appService.createOrUpdateSMModel(payload)
          }
        }
        else if (sheetName === 'DIMENSION Department') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              dimDepartmentCode: null,
              dimDepartmentNameTH: null,
              dimDepartmentNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimDepartment(payload)
          }
        } else if (sheetName === 'DIMENSION Division') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              dimDivisionCode: null,
              dimDivisionNameTH: null,
              dimDivisionNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimDivision(payload)
          }
        } else if (sheetName === 'DIMENSION SubDivision') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              dimSubDivisionCode: null,
              dimSubDivisionNameTH: null,
              dimSubDivisionNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimSubDivision(payload)
          }
        } else if (sheetName === 'DIMENSION EmployeeArea') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              dimEmployeeAreaCode: null,
              dimEmployeeAreaNameTH: null,
              dimEmployeeAreaNameEN: null
            }
            const keys = Object.keys(payload)
            // start from is ignore ลำดับ in sheet
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimEmployeeArea(payload)
          }
        }

        index++
      }
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/dim-group')
  async importDimensionGroupData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/dim-group.xlsx')
      await beginTransaction()
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'DimGroup') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              dimDepartment: null,
              dimDivision: null,
              dimSubDivision: null,
              dimEmployeeArea: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimGroup(payload)
          }
        }
      }
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }

  }

  @Get('/user')
  async importUserData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/user.xlsx')
      await beginTransaction()
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'user') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              userCode: null,
              password: null,
              salt: null,
              firstName: null,
              lastName: null,
              nickname: null,
              citizenId: null,
              email: null,
              phone: null,
              dateStart: null,
              level: null,
              departmentId: null,
              factionId: null,
              smModelId: null,
              taModelId: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              let data = workSheet.getRow(i).getCell(j).value
              if (j === 3) {
                const { encrypted: password, salt } = await passwordHash(data)
                payload.password = password
                payload.salt = salt
              }
              else if (j !== 3 && j !== 4) { //except password and salt
                payload[keys[j - 2]] = data
              }
            }
            await this.appService.createOrUpdateUser(payload)
          }
        }
      }
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/customer')
  async importCustomerData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()

      return res.status(200).json({ code: 200, data: [] })

    } catch (error) {
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/dim-group-customer')
  async importDimGroupCustomerData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/dim-group-customer.xlsx')
      await beginTransaction()
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        console.log(sheetName);

        if (sheetName === 'dimGroupCustomer') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              d365CustomerCode: null,
              dimDepartment: null,
              dimDivision: null,
              dimSubDivision: null,
              dimEmployeeArea: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateDimGroupCustomer(payload)
          }

        }
      }
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/ta-models')
  async importTaModelsData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/ta-model.xlsx')
      await beginTransaction()
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'ta_models') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              departmentCode: null,
              factionCode: null,
              smModelCode: null,
              taModelCode: null,
              taModelNameTH: null,
              taModelNameEN: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            await this.appService.createOrUpdateTAModel(payload)
          }

        }
      }
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/sale-areas')
  async importSaleAreaData(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/sale-area.xlsx')
      const payload_data = []
      // await beginTransaction()
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'sale_area') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              factionCode: null,
              mdCode: null,
              smModelCode: null,
              smCode: null,
              taModelCode: null,
              taCode: null,
              companyName: 'TM',
              saleAreaName: null,
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            payload_data.push(payload)
          }
        }
      }
      const result = await this.appService.createOrUpdateSaleArea(payload_data)
      // await rollback()
      return res.status(200).json({ code: 200, data: result })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }


  @Get('/customer-sale-area')
  async importCustomerSaleArea(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/customer_sa2.xlsx')
      const payload_data = []
      await beginTransaction()
      let index = 0
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'Sheet1') {
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              customerCode: null,
              taModelCode1: null,
              taModelCode2: null,
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            console.log(index++);

            const result = await this.appService.createOrUpdateTAModelCustomer(payload)
          }
        }
      }
      // const result = await this.appService.createOrUpdateTAModelCustomer(payload_data)
      await commit()
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/pp-sale-area')
  async importProjectPendingSaleArea(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/project-pending.xlsx')
      const payload_data = []
      let index = 0
      let index_2 = 0
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'project_pending') {
          await beginTransaction()
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              employeeCode: null,
              projectCode: null,
              projectName: null,
              taModelCode: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            index++
            console.log({ index });
            const result = await this.appService.createOrUpdateTAModelProjectPending(payload)
          }
          await commit()
        }
        else if (sheetName === 'project_contacts') {
          await beginTransaction()
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              projectCode: null,
              refId: null
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            index_2++
            console.log({ index_2 });
            const result = await this.appService.createOrUpdateProjectContact(payload)
          }
          await commit()
        }
      }
      // const result = await this.appService.createOrUpdateTAModelCustomer(payload_data)
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('/update-ta-user')
  async updateUser(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/updateData_TA.xlsx')
      const payload_data = []
      let index = 0
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'Sheet2') {
          await beginTransaction()
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              userCode: null,
              firstName: null,
              lastName: null,
              nickname: null,
              citizenId: null,
              email: null,
              phone: null,
              dateStart: null,
              level: null,
              departmentCode: null,
              factionCode: null,
              smModelCode: null,
              taModelCode: null,
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            index++
            console.log({ index });
            const result = await this.appService.updateUser(payload)
          }
          await commit()
        }
      }
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }



  @Get('/commission')
  async getCommissionReport(@Req() req: Request, @Res() res: Response) {
    const result = await this.appService.getCommissionReport()
    return res.status(200).json({ code: 200, data: result })
  }

  @Get('cus-addr')
  async importCustAddress(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/cus_addr.xlsx')
      const payload_data = []
      let index = 0
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        if (sheetName === 'PERSONAL') {
          await beginTransaction()
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              customerCode: null,
              d365CustomerCode: null,
              addressType: null,
              address: null,
              street: null,
              road: null,
              soi: null,
              countryId: null,
              provinceId: null,
              provinceName: null,
              districtId: null,
              districtName: null,
              subDistrictId: null,
              subDistrictName: null,
              zipcode: null,
              latitude: null,
              longitude: null,
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            index++
            console.log({ index });
            const result = await this.appService.createOrUpdateCustomerAddresses(payload)
          }
          await commit()
        }
        index = 0
        if (sheetName === 'BUSINESS') {
          await beginTransaction()
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            let payload = {
              customerCode: null,
              d365CustomerCode: null,
              addressType: null,
              address: null,
              street: null,
              road: null,
              soi: null,
              countryId: null,
              provinceId: null,
              provinceName: null,
              districtId: null,
              districtName: null,
              subDistrictId: null,
              subDistrictName: null,
              zipcode: null,
              latitude: null,
              longitude: null,
            }
            const keys = Object.keys(payload)
            for (let j = 2; j <= workSheet.actualColumnCount; j++) {
              const data = workSheet.getRow(i).getCell(j).value
              payload[keys[j - 2]] = data
            }
            // payload_data.push(payload)
            index++
            console.log({ index });
            const result = await this.appService.createOrUpdateCustomerAddresses(payload)
          }
          await commit()
        }
      }
      return res.status(200).json({ code: 200, data: [] })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }

  @Get('old-project-pending')
  async importProjectPending(@Req() req: Request, @Res() res: Response) {
    try {
      const workBook = new Exceljs.Workbook()
      const data = await workBook.xlsx.readFile('files/Tm project.xlsx')
      let index = 0
      const resp = []
      for (const workSheet of data.worksheets) {
        const sheetName = workSheet.name
        await beginTransaction()
        if (sheetName === "TM project") {
          let projectCode = null
          for (let i = 2; i <= workSheet.actualRowCount; i++) {
            await this.appService.updateRuningNumber({ prefixType: 'PROJECT PENDING' })
            const last_running_number = await this.appService.findLastRunningNumber({ prefixType: 'PROJECT PENDING' })
            projectCode = await generateCstmCode('PROJECT PENDING', last_running_number)

            const payload = {
              employeeCode: null,
              customerProjectCode: null,
              projectCode: null,
              projectName: null,
              constructionTypeId: null,
              constructionStatusId: null,
              subConstructionStatusId: null,
              saleStatusId: null,
              projectSourceId: null,
              projectValue: null,
              projectStart: null,
              projectEnd: null,
              address: null,
              countryId: null,
              provinceId: null,
              districtId: null,
              subDistrictId: null,
              zipcode: null,
              latitude: null,
              longitude: null,
            }
            const keys = Object.keys(payload)
            // start 1 เพราะไม่มี column แรกที่เป็นลำดับเหมือน excel อันอื่น
            for (let j = 1; j <= workSheet.actualColumnCount; j++) {
              let data = workSheet.getRow(i).getCell(j).value
              if(['latitude','longitude'].includes(keys[j - 1]) && !data){
                data = 0.00
              }
            }
            payload.projectCode = projectCode
            console.log({index});
            index++
            const response = await this.appService.createOrUpdateOldProjectPending(payload)
            resp.push(response)
            
          }
        }
        await commit()
      }
      return res.status(200).json({ code: 200, data: resp })
    } catch (error) {
      await rollback()
      console.log(error);
      return res.status(500).json({ code: 500, data: [] })
    }
  }


  @Get()
  getHello(): string {
    console.log(MYSQL);

    return this.appService.getHello();
  }
}
