using AssetrazContracts.DTOs;
using AssetrazContracts.Images;
using System.Text;

namespace AssetrazContracts.Constants
{
    public static class HTMLTemplates
    {
        /*
           These string components are replaced with respective value to generate PDF
            <Valorem_Logo/>                     - Valorem logo image path
            <PONumber/>                         - Purchase order number
            <PODate/>                           - Purchase order date
            <PurchaseOrderLineItemDetails/>     - Purchase order details in line item(HTML component)
            <SubTotal/>                         - Sub total bill amount
            <TotalAmount/>                      - Total bill amount
            <VendorName/>                       - Vendor name
            <VendorAddress1/>                   - Vendor address line 1
            <VendorAddress2/>                   - Vendor address line 2
            <VendorAddress3/>                   - Vendor address line 3
            <VendorAddress4/>                   - Vendor address line 4
            <VendorGSTNumber/>                  - Vendor GST number
         */

        private const string PurchaseDetailHTMLTemplate = @"
            <html>
                <head>
                    <meta http-equiv=Content-Type content='text/html; charset=windows-1252'>
                    <style type='text/css'>
                        .table {
                            padding:5px;
                            color:windowtext;
                            font-size:10.0pt;
                            font-weight:400;
                            font-style:normal;
                            text-decoration:none;
                            font-family:'Century Gothic', sans-serif;
                            text-align:general;
                            vertical-align:bottom;
                            white-space:nowrap;
                        }                  
                        .container {
                            display: table;
                            width:100%;
                        }
                        .row {
                            display: table-row;
                        }
                        .cell {
                            display: table-cell;
                            padding-left: 5px;
                            padding-right: 5px;
                        }
                        .rowborders
                            {border-top:none;
                            border-right:.5pt solid windowtext;
                            border-bottom:none;
                            border-left:.5pt solid windowtext;}
                        .cellborders
                            {border-top: .5pt solid grey;
                            border-bottom: .5pt solid grey;
                            padding: 2px;}
                        .itemheader
                            {font-weight: bold;
                            font-size: 8.0pt;
                            text-align: center;}
                        .itemdetail
                            {font-weight: lighter;
                            font-size: 8.0pt;
                            white-space: pre-line;
                            white-space: -moz-pre-wrap;
                            white-space: -pre-wrap;
                            white-space: -o-pre-wrap;
                            word-wrap: break-word;}
                        .number
                            {width: 10%;
                            height: 2px;
                            text-align: center;
                            vertical-align: middle;} 
                        .description
                            {width: 50%;
                            height: 2px;
                            border-left: .5pt solid windowtext;
                            border-right: .5pt solid windowtext;
                            text-align: left;}   
                        .itemamount
                            {width: 15%;
                            height: 2px;;
                            border-left: .5pt solid windowtext;
                            text-align: right;
                            vertical-align: middle;}        
			            .label
    			            {padding-left: 5px;
                            padding-right: 5px;
                            padding-top: 0px;
	    		            color:windowtext;
				            font-size:8.0pt;
				            font-style:normal;
                            font-weight: bold;
				            text-decoration:none;
				            font-family:'Century Gothic', sans-serif;
				            text-align:left;
				            vertical-align:bottom;
				            background:white;
				            white-space:nowrap;}  
                        .data
				            {padding-left: 5px;
                            padding-right: 5px;
                            padding-top: 0px;
				            color:windowtext;
			                font-size:8.0pt;
				            font-style:normal;
                            font-weight: lighter;
				            text-decoration:none;
				            font-family:'Century Gothic', sans-serif;
				            text-align:left;
				            vertical-align:bottom;
				            white-space:nowrap;}                
                    </style>
                </head>
                <body>
                    <div class='table'>
                        <div class='container rowborders' style='border-top:.5pt solid windowtext'>
                            <div class='row'>
                                <div class='cell' style='color:#366092;font-size:18pt;font-weight:500;text-align: right;'>Purchase Order</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 70%'><img style='width:30%; height:30%' src='<Valorem_Logo/>'></div>
                                <div class='cell label' style='width: 50pt'>Date:</div>
                                <div class='cell data' style='width: 50pt'><PODate/></div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 70%'>&nbsp;</div>
                                <div class='cell label' style='width: 50pt'>P.O. #:</div>
                                <div class='cell data' style='width: 50pt'><PONumber/></div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>            
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell label' style='width: 10%;height: 2px;'>Supplier</div>
                                <div class='cell label' style='width: 35%;height: 2px;'><VendorName/></div>
                                <div class='cell label' style='width: 10%;height: 2px;'>Invoice To</div>
                                <div class='cell label' style='width: 35%;height: 2px;'>Valorem Private Limited</div>
                                <div class='cell label' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>            
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'><VendorAddress1/></div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>Office No.305 &amp; 306</div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>               
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'><VendorAddress2/></div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>3rd Floor, SCK-01</div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'><VendorAddress3/></div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>Smartcity, Kochi,</div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'><VendorAddress4/></div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>Kakkanad</div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>GST Number: <VendorGSTNumber/></div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                                <div class='cell data' style='width: 35%;height: 2px;'>GSTIN - 32AABCI2252G3Z2</div>
                                <div class='cell data' style='width: 10%;height: 2px;'>&nbsp;</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data' style='width: 50%;height: 2px;'>Premises under contract</div>
                                <div class='cell data' style='width: 25%;height: 2px;'>Treatment Area</div>
                                <div class='cell data' style='width: 25%;height: 2px;'>Mode/Terms of Payment</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell data cellborders' style='width: 50%;height: 2px;border-right: .5pt solid grey;'>Valorem Pvt Ltd, SmartCity, Kakkanad</div>
                                <div class='cell data cellborders' style='width: 25%;height: 2px;border-right: .5pt solid grey;'>Premises at SmartCity, Kakkanad</div>
                                <div class='cell data cellborders' style='width: 25%;height: 2px;'>EFT (Electronic Funds Transfer)</div>
                            </div>
                        </div>    
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders' style='padding-top: 2px; padding-bottom: 2px; border-top:.5pt solid windowtext; border-bottom:.5pt solid windowtext'>
                            <div class='row'>
                                <div class='cell itemheader' style='width: 10%;height: 2px;border-right: .5pt solid windowtext'>Sl.No</div>
                                <div class='cell itemheader' style='width: 50%;height: 2px;border-right: .5pt solid windowtext'>Description</div>
                                <div class='cell itemheader' style='width: 10%;height: 2px;border-right: .5pt solid windowtext'>Qty</div>
                                <div class='cell itemheader' style='width: 15%;height: 2px;border-right: .5pt solid windowtext'>Amount</div>
                                <div class='cell itemheader' style='width: 15%;height: 2px;'>Total</div>
                            </div>
                        </div>    
                        <PurchaseOrderLineItemDetails/>
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 70%'>&nbsp;</div>
                                <div class='cell label' style='width: 50pt; text-align: right;'>Subtotal:</div>
                                <div class='cell data' style='width: 50pt; text-align: right;'><SubTotal/></div>
                            </div>
                        </div>  
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 100%'>
                                    <div class='cell label'>Amount in words:</div>
                                    <div class='cell data'>amount_in_words</div>
                                </div>
                            </div>
                        </div>  
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 70%'>&nbsp;</div>
                                <div class='cell label' style='width: 50pt; text-align: right;'>Total:</div>
                                <div class='cell data' style='width: 50pt; text-align: right;'><TotalAmount/></div>
                            </div>
                        </div>  
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 70%'>&nbsp;</div>
                                <div class='cell label' style='width: 50pt;'>&nbsp;</div>
                                <div class='cell data' style='width: 50pt;'><TodayDate/></div>
                            </div>
                        </div>  
                        <div class='container rowborders'>
                            <div class='row'>
                                <div class='cell' style='width: 70%'>&nbsp;</div>
                                <div class='cell data' style='width: 50pt; border-top: .5pt solid windowtext; font-style: italic;'>Authorized by</div>
                                <div class='cell data' style='width: 50pt;  border-top: .5pt solid windowtext; font-style: italic;'>Date</div>
                            </div>
                        </div>  
                        <div class='container rowborders'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                        <div class='container rowborders' style='border-bottom: .5pt solid windowtext'>
                            <div class='row '>
                                <div class='cell' style='width: 100%'>&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
		";

        private const string ProcurementDetailsHTMLTemplate = @"
                            <html>
                <head>
                    <meta http-equiv=Content-Type content='text/html; charset=windows-1252'>
                    <style type='text/css'>
                        .table {
                            padding:5px;
                            color:windowtext;
                            font-size:10.0pt;
                            font-weight:400;
                            font-style:normal;
                            text-decoration:none;
                            font-family:'Century Gothic', sans-serif;
                            text-align:general;
                            vertical-align:bottom;
                            white-space:nowrap;
                        }                  
                        .container {
                            display: table;
                            width:100%;
                        }
                        .row {
                            display: table-row;
                        }
                        .cell {
                            display: table-cell;
                            padding-left: 5px;
                            padding-right: 5px;
                        }
                        .rowborders
                            {border-top:none;
                            border-right:.5pt solid windowtext;
                            border-bottom:none;
                            border-left:.5pt solid windowtext;}
                        .itemheader
                            {font-weight: bold;
                            font-size: 8.0pt;
                            text-align: center;}
                        .itemdetail
                            {font-weight: lighter;
                            font-size: 8.0pt;
                            white-space: pre-line;
                            white-space: -moz-pre-wrap;
                            white-space: -pre-wrap;
                            white-space: -o-pre-wrap;
                            word-wrap: break-word;}
                        .number
                            {width: 6%;
                            height: 2px;
                            text-align: center;
                            vertical-align: middle;} 
                        .description
                            {width: 44%;
                            height: 2px;
                            border-left: .5pt solid windowtext;
                            text-align: left;}   
                        .details
                            {width: 13.3%;
                            height: 2px;;
                            border-left: .5pt solid windowtext;
                            text-align: left;
                            vertical-align: middle;}
                        .quantity
                            {width: 10%;
                            height: 2px;;
                            border-left: .5pt solid windowtext;
                            text-align: right;
                            vertical-align: middle;}
                    </style>
                </head>
                <body>
                    <div class='table'>
                        <div class='container rowborders' style='padding-top: 2px; padding-bottom: 2px; border-top:.5pt solid windowtext; border-bottom:.5pt solid windowtext'>
                            <div class='row'>
                                <div class='cell itemheader' style='width: 6%;height: 2px;border-right: .5pt solid windowtext'>Sl No.</div>
                                <div class='cell itemheader' style='width: 13.3%;height: 2px;border-right: .5pt solid windowtext'>Category</div>
                                <div class='cell itemheader' style='width: 13.3%;height: 2px;border-right: .5pt solid windowtext'>Manufacturer</div>
                                <div class='cell itemheader' style='width: 13.3%;height: 2px;border-right: .5pt solid windowtext'>Model Number</div>
                                <div class='cell itemheader' style='width: 44%;height: 2px;border-right: .5pt solid windowtext'>Specifications</div>
                                <div class='cell itemheader' style='width: 10%;height: 2px;'>Quantity</div>
                            </div>
                        </div>
                                <ProcurementDetailsLineItem/>
                    </div>
                </body>
            </html>
        ";

        public static string GetPurchaseDetailHTMLTemplate(List<PurchaseOrderDetailsFunctionDto> purchaseDetails, VendorDetailsDto vendorDetails)
        {
            StringBuilder pdfBuilder = new StringBuilder(PurchaseDetailHTMLTemplate);

            //Valorem logo file path
            string logoPath1 = ImageFunction.ValoremLogoFilePath;
            pdfBuilder.Replace("<Valorem_Logo/>", logoPath1);

            //Purchase details
            pdfBuilder.Replace("<PONumber/>", purchaseDetails.First().PurchaseOrderNumber);
            pdfBuilder.Replace("<PODate/>", string.Format("{0:dd/MM/yyyy}", purchaseDetails.First().POGeneratedOn));

            StringBuilder purchaseOrderDetails = new StringBuilder();
            var totalAmount = purchaseDetails.Sum(pd => pd.Quantity * pd.RatePerQuantity);
            for (int i = 0; i < purchaseDetails.Count; i++)
            {
                var lineTotal = purchaseDetails[i].RatePerQuantity * purchaseDetails[i].Quantity;
                purchaseOrderDetails.Append($@"
                        <div class='container rowborders' style='padding-top: 2px; padding-bottom: 2px; border-bottom:.5pt solid windowtext'>
                            <div class='row'>
                                <div class='cell itemdetail number'>{i + 1}</div>
                                <div class='cell itemdetail description'>{purchaseDetails[i].Specifications}</div>
                                <div class='cell itemdetail number'>{Math.Truncate(purchaseDetails[i].Quantity)}</div>
                                <div class='cell itemdetail itemamount'>{purchaseDetails[i].RatePerQuantity.ToString("0.00")}</div>
                                <div class='cell itemdetail itemamount'>{lineTotal.ToString("0.00")}</div>
                            </div>
                        </div>  ");

            }
            pdfBuilder.Replace("<PurchaseOrderLineItemDetails/>", purchaseOrderDetails.ToString());
            pdfBuilder.Replace("<TotalAmount/>", totalAmount.ToString("0.00"));
            pdfBuilder.Replace("<SubTotal/>", totalAmount.ToString("0.00"));


            // Vendor details 
            pdfBuilder.Replace("<VendorName/>", vendorDetails.VendorName);
            pdfBuilder.Replace("<VendorAddress1/>", vendorDetails.VendorAddressLine1);
            pdfBuilder.Replace("<VendorAddress2/>", vendorDetails.VendorAddressLine2);
            pdfBuilder.Replace("<VendorAddress3/>", $"{vendorDetails.City}, {vendorDetails.State}");
            pdfBuilder.Replace("<VendorAddress4/>", vendorDetails.Country);
            pdfBuilder.Replace("<VendorGSTNumber/>", vendorDetails.Gstin);

            pdfBuilder.Replace("<TodayDate/>", string.Format("{0:dd/MM/yyyy}", DateTime.Now));

            return pdfBuilder.ToString();
        }

        public static string GetProcurementDetailsHTMLTemplate(List<RequestQuoteDto> procurementDetails)
        {
            StringBuilder pdfBuilder = new StringBuilder(ProcurementDetailsHTMLTemplate);

            //Procurement details
            StringBuilder purchaseOrderDetails = new StringBuilder();
            for (int i = 0; i < procurementDetails.Count; i++)
            {
                purchaseOrderDetails.Append($@"
                        <div class='container rowborders' style='padding-top: 2px; padding-bottom: 2px; border-bottom:.5pt solid windowtext'>
                            <div class='row'>
                                <div class='cell itemdetail number'>{i + 1}</div>
                                <div class='cell itemdetail details'>{procurementDetails[i].CategoryName}</div>
                                <div class='cell itemdetail details'>{procurementDetails[i].ManufacturerName}</div>
                                <div class='cell itemdetail details'>{procurementDetails[i].ModelNumber}</div>
                                <div class='cell itemdetail description'>{procurementDetails[i].Specifications}</div>
                                <div class='cell itemdetail quantity'>{procurementDetails[i].Quantity}</div>
                            </div>
                        </div>  ");
            }
            pdfBuilder.Replace("<ProcurementDetailsLineItem/>", purchaseOrderDetails.ToString());

            return pdfBuilder.ToString();
        }
    }
}
