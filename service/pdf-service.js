const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, userdata) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Function to generate the header of the PDF
  function generateHeader(doc) {
    doc.image('Public/img/download.png', 35, 20, { width: 80 });
    doc.fillColor("#444444").fontSize(20).font("Helvetica-Bold");
    doc.text("Gcart", { align: "center" });
    doc.fontSize(10);
    doc.text("Gcart", 200, 50, { align: "right" });
    doc.text("Dotspace Business Park", 200, 65, { align: "right" });
    doc.text("Trivandrum, 695582", 200, 80, { align: "right" });
    doc.moveDown();
  }

  // Function to generate customer information section
  function generateCustomerInformation(doc) {
    doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);
    generateHr(doc, 185); // Horizontal line
    const customerInformationTop = 200; // Position of the data

    doc.fontSize(10)
      .text("Invoice Number:", 50, customerInformationTop)
      .text(userdata.orderid, 150, customerInformationTop)
      .text("Invoice Date:", 50, customerInformationTop + 30)
      .text(formatDate(new Date()), 150, customerInformationTop + 30)
      .text("Grand Total:", 50, customerInformationTop + 45)
      .text(userdata.alltotal, 150, customerInformationTop + 45)
      .text(userdata.adress.Name, 350, customerInformationTop) // Name of the customer
      .text(userdata.adress.Address, 350, customerInformationTop + 15) // Address of the customer
      .text(userdata.adress.City, 350, customerInformationTop + 30)
      .text(userdata.adress.MobileNumber, 350, customerInformationTop + 50)
      .moveDown();

    generateHr(doc, 272);
  }

  // Function to generate the invoice table
  function generateInvoiceTable(doc) {
    let i;
    const invoiceTableTop = 350;
    generateTableRow(doc, invoiceTableTop, "SL.No", "Name", "Unit Cost", "Quantity", "Total");
    generateHr(doc, invoiceTableTop + 20);

    let subtotal = 0;

    for (i = 0; i < userdata.alliteams.length; i++) {
      const item = userdata.alliteams[i];
      let position; // Declare position here

      if (item.OfferPrice) {
        subtotal += item.OfferPrice;
        position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          position,
          i + 1,
          item.Model,
          (item.OfferPrice / item.Count).toFixed(2), // Format unit cost
          item.Count,
          item.OfferPrice.toFixed(2) // Format total
        );
      } else {
        subtotal += item.Price;
        position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          position,
          i + 1,
          item.Model,
          (item.Price / item.Count).toFixed(2), // Format unit cost
          item.Count,
          item.Price.toFixed(2) // Format total
        );
      }
      generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", subtotal.toFixed(2)); // Format subtotal

    const discountToDatePosition = subtotalPosition + 20;
    generateTableRow(doc, discountToDatePosition, "", "", "Discount", "20%");

    const deliverychargeToDatePosition = discountToDatePosition + 20;
    generateTableRow(doc, deliverychargeToDatePosition, "", "", "Delivery Charge", "50");

    const grandTotalPosition = deliverychargeToDatePosition + 40;
    generateTableRow(doc, grandTotalPosition, "", "", "Grand Total", "", userdata.alltotal.toFixed(2)); // Format grand total
  }

  // Function to generate a table row
  function generateTableRow(doc, y, slno, name, unitCost, quantity, total) {
    const cellWidth = 90; // Width of each cell
    doc.fontSize(10)
      .text(slno, 50, y)
      .text(name, 150, y, { width: cellWidth, height: 20 }) // Set a maximum width for the name cell
      .text(unitCost, 150 + cellWidth, y, { width: cellWidth, align: "right" })
      .text(quantity, 150 + 2 * cellWidth, y, { width: cellWidth, align: "right" })
      .text(total, 150 + 3 * cellWidth, y, { width: cellWidth, align: "right" });
  }

  // Function to generate horizontal line
  function generateHr(doc, y) {
    doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
  }

  // Function to format a date
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + "/" + month + "/" + year;
  }

  // Generate the header, customer information, and invoice table
  generateHeader(doc);
  generateCustomerInformation(doc);
  generateInvoiceTable(doc);

  // Footer of the PDF
  doc.fontSize(10).text('Thank You for shopping with us again', 50, 750, { align: 'center', width: 500 });

  // End the document
  doc.end();
}

module.exports = { buildPDF };
