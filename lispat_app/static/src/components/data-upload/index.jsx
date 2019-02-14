import React, { Component } from 'react';
import path from 'path';
import axios from 'axios';
import { Col, Container, Row, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import FileUpload from './upload';
import './home-upload.css';

const endpoint = 'http://localhost:5000/upload';


class DataUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file1: null,
      file2: null,
      loaded: 0,
    };
  }

  setFileOne = file => {
    this.setState({
      file1: file,
    });
  };

  setFileTwo = file => {
    this.setState({
      file2: file,
    });
  };

  handleUpload = () => {
    const { file1, file2 } = this.state;
    const { stateChange, getData } = this.props;
    const data = new FormData();
    data.append('file1', file1, file1.name);
    data.append('file2', file2, file2.name);
    axios
      .post(endpoint, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
          });
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        stateChange(res.status);
        const resp = res.data;
        resp.submission_file_name =
          file1.name.substring(0, file1.name.lastIndexOf('.')) || file1.name;
        resp.standard_file_name =
          file2.name.substring(0, file2.name.lastIndexOf('.')) || file2.name;
        getData(resp);
      });
  };

  render() {
    const { file1, file2, loaded } = this.state;
    return (
      <div>
        <br />
        <br />
        <div className="markdown-body body-upload">
          <div className="header-upload"> Upload Documents </div>
          <hr />
          <div className="center-grid">
            <Row>
              <Col>
                <div className="font-home">First:</div>
                <FileUpload handleStateChange={this.setFileOne} />
                {file1 ? <div className="file-name">{file1.name}</div> : ''}
              </Col>
              <Col>
                <div className="font-home">Second: </div>
                <FileUpload handleStateChange={this.setFileTwo} />
                {file2 ? <div className="file-name">{file2.name}</div> : ''}
              </Col>
            </Row>
          </div>
          <br />
          <Row>
            <div className="go-pos">
              <Col>
                {file1 !== null && file2 !== null ? (
                  <Button
                    type="button"
                    className="go-button"
                    onClick={this.handleUpload}
                  >
                    GO
                  </Button>
                ) : null}
              </Col>
            </div>
            {loaded !== 0 ? (
              <div className="progress">{Math.round(loaded)} %</div>
            ) : null}
          </Row>
        </div>
      </div>
    );
  }
}

DataUpload.propTypes = {
  stateChange: PropTypes.func,
  getData: PropTypes.func,
};

export default DataUpload;
