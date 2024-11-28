import { Modal, Accordion } from "flowbite-react";
import PaymentForm from '../../Components/Payments/PaymentForm';


const ModalPasarelaPago = ({ isOpen, toggleModal, total, carrito }) => {
  console.log("carrito", carrito)
  return (
    <Modal show={isOpen} onClose={toggleModal} size="7xl">
      <Modal.Header>
        <h2 className="text-2xl font-bold">Método de Pago</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="shadow-md shadow-slate-200">
          <section className="">
            <Accordion collapseAll className="shadow-md shadow-slate-200">
              <Accordion.Panel>
                <Accordion.Title>Tarjeta de crédito o débito</Accordion.Title>
                <Accordion.Content>
                  <PaymentForm total={total} carrito={carrito} />
                </Accordion.Content>
              </Accordion.Panel>
              <Accordion.Panel>
             {/**    <Accordion.Title>Mercado pago</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    Flowbite is first conceptualized and designed using the Figma software so everything you see in the
                    library has a design equivalent in our Figma file.
                  </p>
                </Accordion.Content>*/}
              </Accordion.Panel>
            </Accordion>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={toggleModal}
        >
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPasarelaPago;
