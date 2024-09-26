using System;
using System.Linq;
using System.Web.Mvc;
using ContactAppProject.Data;
using ContactAppProject.Models;

namespace ContactAppProject.Controllers
{
    //controller for handling contact details, accessible only by staff
    [Authorize(Roles = "Staff")]
    public class ContactDetailController : Controller
    {
        // GET: ContactDetail - displays the contact detail view for the specified contact ID
        public ActionResult Index(Guid contactId)
        {
            //store contact ID in TempData for later use
            TempData["ContactId"] = contactId;
            return View();
        }

        //retrieves and paginates contact details based on provided parameters
        public ActionResult GetContactDetails(int page, int rows, string sidx, string sord, bool _search, string searchField, string searchString, string searchOper)
        {
            Guid contactId = (Guid)TempData.Peek("ContactId");
            using (var session = NHibernateHelper.CreateSession())
            {
                var contactDetails = session.Query<ContactDetails>()
                   .Where(cd => cd.Contact.Id == contactId);
                //.OrderBy(cd => cd.Number) // Default order
                //.ToList();

                if (_search && searchField == "Email" && searchOper == "eq")
                {
                    contactDetails = contactDetails.Where(cd => cd.Email == searchString);
                }

                //get total count of records(for pagination)
                int totalCount = contactDetails.Count();
                //calculate total pages
                int totalPages = (int)Math.Ceiling((double)totalCount / rows);

                // Apply sorting
                switch (sidx)
                {
                    case "Email":
                        contactDetails = sord == "asc" ? contactDetails.OrderBy(cd => cd.Email)
                                                         : contactDetails.OrderByDescending(cd => cd.Email);
                        break;

                    case "Number":
                        contactDetails = sord == "asc" ? contactDetails.OrderBy(cd => cd.Number)
                                                         : contactDetails.OrderByDescending(cd => cd.Number);
                        break;

                    default:
                        break;
                }


                var jsonData = new
                {
                    total = totalPages,
                    page,
                    records = totalCount,
                    rows = contactDetails
                    .Skip((page - 1) * rows)
                    .Take(rows)
                    .Select(detail => new
                    {
                        cell = new string[]
                        {
                        detail.Id.ToString(),
                        detail.Number.ToString(),
                        detail.Email
                        }
                    }).ToArray()
                };

                return Json(jsonData, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult AddContactDetail(ContactDetails contactDetail)
        {
            Guid contactId = (Guid)TempData.Peek("ContactId");
            using (var session = NHibernateHelper.CreateSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var contact = session.Query<Contact>().SingleOrDefault(c => c.Id == contactId);
                    contactDetail.Contact = contact;
                    session.Save(contactDetail);
                    transaction.Commit();
                    return Json(new { success = true, message = "Contact Detail added successfully" });
                }
            }
        }
        public ActionResult DeleteContactDetail(Guid id)
        {
            using (var session = NHibernateHelper.CreateSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var contactDetail = session.Query<ContactDetails>().FirstOrDefault(cd => cd.Id == id);
                    session.Delete(contactDetail);
                    transaction.Commit();
                    return Json(new { success = true, message = "Contact Detail Deleted Successfully" });
                }
            }
        }

        public ActionResult EditContactDetail(ContactDetails contactDetails)
        {
            using (var session = NHibernateHelper.CreateSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    var existingContactDetail = session.Query<ContactDetails>().FirstOrDefault(cd => cd.Id == contactDetails.Id);
                    if (existingContactDetail != null)
                    {
                        existingContactDetail.Number = contactDetails.Number;
                        existingContactDetail.Email = contactDetails.Email;
                        session.Update(existingContactDetail);
                        transaction.Commit();
                        return Json(new { success = true, message = "Contact Detail Edited Successfully." });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Contact Detail not found." });
                    }
                }

            }
        }
    }
}