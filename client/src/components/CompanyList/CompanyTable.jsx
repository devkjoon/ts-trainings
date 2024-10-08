import React, { useState } from 'react';
import { Table, Button, Row, Col, Collapse } from 'react-bootstrap';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';

const CompanyTable = ({ companies, handleShowEditModal, handleDeleteCompany }) => {
  const [open, setOpen] = useState({});

  const toggleCollapse = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th className="main-column">Company Name</th>
            <th className="main-column">Contact Name</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <React.Fragment key={company._id}>
              <tr onClick={() => toggleCollapse(company._id)}>
                <td className="main-column">
                  <span className="label-prefix">Company: </span>
                  <span className="data-text">{company.name}</span>
                </td>
                <td className="main-column">
                  <span className="label-prefix">Contact: </span>
                  <span className="data-text">{company.contact.name}</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="p-0">
                  <Collapse in={open[company._id]}>
                    <div className="p-2">
                      <div className="table-responsive">
                        <Table bordered>
                          <tbody>
                            <tr>
                              <td>
                                <strong>Phone Number:</strong>
                              </td>
                              <td>{formatPhoneNumber(company.phoneNumber)}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Address:</strong>
                              </td>
                              <td>{`${company.address.streetAddress}, ${company.address.city}, ${company.address.state} ${company.address.zipcode}`}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Contact Email:</strong>
                              </td>
                              <td>{company.contact.email}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Contact Phone:</strong>
                              </td>
                              <td>{formatPhoneNumber(company.contact.phoneNumber)}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Actions:</strong>
                              </td>
                              <td className="actions-cell">
                                <Row>
                                  <Col>
                                    <Button
                                      variant="outline-warning"
                                      onClick={() => handleShowEditModal(company)}
                                    >
                                      Edit Company
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      variant="outline-danger"
                                      onClick={() => handleDeleteCompany(company._id)}
                                    >
                                      Delete Company
                                    </Button>
                                  </Col>
                                </Row>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CompanyTable;
