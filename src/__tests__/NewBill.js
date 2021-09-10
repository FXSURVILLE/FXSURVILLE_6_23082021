import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase.js"


// test ouverture page
describe("Given I am connected as an employee ", () => {
  describe("When I arrived on NewBill Page", () => {
    test("Then, I check expected page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html;
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    })
    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const iconActive = screen.getByTestId("icon-mail")
      expect(iconActive.classList.contains("active-icon")).toBeTruthy
      // const iconActives = screen.getByTestId("icon-window")
      // expect(iconActives.classList.contains("active-icon")).not.toBeTruthy
    })
    test("Then, I check expected inputs", () => {
      const html = NewBillUI()
      document.body.innerHTML = html;
      // Type de dépense
      const inputType = screen.queryByTestId("expense-type")
      expect(inputType).toBeTruthy()
      expect(screen.getAllByText("Type de dépense")).toBeTruthy();
      // Nom de la dépense
      const inputNom = screen.queryByTestId("expense-name")
      expect(inputNom).toBeTruthy()
      expect(screen.getAllByText("Nom de la dépense")).toBeTruthy();
      // Date
      const inputDate = screen.queryByTestId("datepicker")
      expect(inputDate).toBeTruthy()
      expect(screen.getAllByText("Date")).toBeTruthy();
      // Montant TTC
      const inputMontant = screen.queryByTestId("amount")
      expect(inputMontant).toBeTruthy()
      expect(screen.getAllByText("Montant TTC")).toBeTruthy();
      // TVA
      const inputTVA1 = screen.queryByTestId("vat")
      expect(inputTVA1).toBeTruthy()
      const inputTVA2 = screen.queryByTestId("pct")
      expect(inputTVA2).toBeTruthy()
      expect(screen.getAllByText("TVA")).toBeTruthy();
      // Commentaire
      const inputCommentaire = screen.queryByTestId("commentary")
      expect(inputCommentaire).toBeTruthy()
      expect(screen.getAllByText("Commentaire")).toBeTruthy();
      // Justificatif
      const inputJustificatif = screen.queryByTestId("file")
      expect(inputJustificatif).toBeTruthy()
      expect(screen.getAllByText("Justificatif")).toBeTruthy();
    })
    test("Then, I check send btn", () => {
      const html = NewBillUI()
      document.body.innerHTML = html;
      const sendBtn = document.getElementById("btn-send-bill")
      expect(sendBtn).toBeTruthy();
    })
  })
})

// test fichiers
describe("Given I am on NewBill Page", () => {
  describe("When I add a new file", () => {
    test("Then, I choose a bad file type", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const newFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      newFile.addEventListener("change", handleChangeFile)
      fireEvent.change(newFile, {
        target: {
          files: [new File(["doc1"], "doc1.pdf", { type: "pdf/pdf" })],
        },
      })
      expect(handleChangeFile).toHaveBeenCalled()
      const btnSendBill = document.getElementById('btn-send-bill')
      expect(btnSendBill.disabled).toBeTruthy()
    })
    test("Then, I choose a good document type", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const newFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      newFile.addEventListener("change", handleChangeFile)
      fireEvent.change(newFile, {
        target: {
          files: [new File(["doc2"], "doc2.jpg", { type: "image/jpeg" })],
        },
      })
      expect(handleChangeFile).toHaveBeenCalled()
      const btnSendBill = document.getElementById('btn-send-bill')
      expect(btnSendBill.disabled).toBe(false)
    })
  })

  // test submit
  describe("When I want to submit", () => {
    test("Then, I click on the submit button", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const submitNewBill = screen.getByTestId('form-new-bill')
      submitNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitNewBill)
      expect(handleSubmit).toHaveBeenCalled();
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