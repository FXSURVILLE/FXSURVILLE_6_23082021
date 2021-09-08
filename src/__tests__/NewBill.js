import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When create a new bill", () => {
    test("add new bill from mock API POST", async () => {
       const postSpy = jest.spyOn(firebase, "post")
       const newBill = {
        id: "",
        status: "",
        pct: "",
        amount: "",
        email: "",
        name: "test newBill",
        vat: "",
        fileName: "newBill",
        date: "2021-09-07",
        commentAdmin: "",
        commentary: "",
        type: "",
        fileUrl: "",
       }
       const bills = await firebase.post(newBill)
       expect(postSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(5)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})