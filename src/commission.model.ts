import { query } from "@/config/db_connection";

export class CommissionModel {
    async getCommissionReport(){
        const result = await query(`
        SELECT 
        customer_settlements.LastSettleDate, customer_settlements.LastSettleVoucher,export_invoices.SalesOrder, export_invoices.InvoiceDueDate, export_invoices.InvoiceNo, export_invoices.id,
        export_invoices.InvoiceAccount, export_invoices.InvoiceAccountName, export_invoices.OrderAccount, export_invoices.OrderAccountName,
        export_invoice_products.id, export_invoice_products.FinDepartmentName, export_invoice_products.IVZS_DivisionName, 
        export_invoice_products.IVZS_SubDivisionName, export_invoice_products.IVZS_EmployeeAreaName,export_invoice_products.Quanity,
        CONCAT(export_invoice_products.ItemNumber, export_invoice_products.ColorId, export_invoice_products.SizeId, export_invoice_products.StyleId, export_invoice_products.ConfigId) AS invProductSku,
        export_invoice_products.Description,product_dimensions.RENumber, product_dimensions.agentAnotherNumber, product_dimensions.startingPrice,
        export_invoice_products.DiscountPercent,
        export_invoice_products.LineAmount AS IVZS_LineAmount
        FROM allkons_db.customer_settlements
        LEFT JOIN export_invoices on export_invoices.InvoiceNo = customer_settlements.invoiceId 
        LEFT JOIN export_invoice_products on export_invoice_products.InvoiceNo = customer_settlements.invoiceId 
        LEFT JOIN product_dimensions on product_dimensions.productSku = CONCAT(export_invoice_products.ItemNumber, export_invoice_products.ColorId, export_invoice_products.SizeId, export_invoice_products.StyleId, export_invoice_products.ConfigId);
        `)
        return result
    }
}

//ข้อมูลแสดงตาม settlement 
// export invoiceCN, export invoice product, customer settlement ref with invNo
// จะรู้ได้ไงว่า export_invoice_product ไหนที่ต้องนำมาแสดง ถ้าจะต้องขึ้นอยู่กับ customer settlement