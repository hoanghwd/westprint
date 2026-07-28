import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { handleSkip, handleGoLive } from '../../../actions';
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";

import "./Shared.css";

const TNC = `
<H4>Terms of Use</H4>
<p>
JONDO (“JONDO” or “Company”) provides the content and products and/or services available or advertised on this website (the “Website”) subject to the terms and conditions of use set forth below, the Privacy Policy and any other terms and conditions which may exist otherwise on the Website or in relation to promotions, contests or sweepstakes conducted on the Website (collectively the “Terms”).
</p>
<H5>API</H5>
<p>
JONDO’s API testing process ensures that the Customer receives the correct output. It is highly recommended that the JONDO API test plan is successfully completed to avoid any unforeseen live order issues. If decided by the Customer to waive the testing process, the Customer agrees to defend and hold harmless any liability, claims, damages, or any other expenses arising from foregoing the test plan.
</p>
<H5>Acceptance of Terms</H5>
<p>
By accessing and using this Website, you expressly acknowledge and agree that you have read the Terms of use and that you accept them as written. YOU FURTHER WARRANT AND REPRESENT THAT, BEFORE ACCESSING AND USING THIS WEBSITE, YOU HAD AMPLE OPPORTUNITY TO READ THESE TERMS OF USE CAREFULLY AND THAT FOLLOWING SUCH REVIEW, YOU KNOWINGLY AND VOLUNTARILY CONSENTED TO THE SAME. If you do not agree to these Terms of use, you may not access or otherwise use this Website.
</p>
<H5>Right to Modify Terms</H5>
<p>
JONDO reserves the right, at its sole discretion, to change, modify, add or remove any portion of this Agreement, in whole or in part, at any time. Notification of changes in the Agreement will be posted on the Website. Your continued use of and access to the Website constitutes your acceptance of any amendments or modifications to the Terms.
</p>
<H5>Password Security</H5>
<p>
In order to access the services offered on the Website, you must complete the registration process by providing the complete and accurate information requested on the registration form. You will also be asked to provide a user name and password. You are entirely responsible for maintaining the confidentiality of your password. You may not use the account, username, or password of someone else at any time. You agree to notify JONDO immediately of any unauthorized use of your account, user name, or password. JONDO shall not be liable for any loss that you incur as a result of someone else using your password, either with or without your knowledge. You may be held liable for any losses incurred by JONDO, its affiliates, officers, directors, employees, consultants, agents, and representatives due to someone else’s use of your account or password.
</p>
<H5>User Content</H5>
<p>
You grant JONDO a non-exclusive, transferable, sublicensable, worldwide license to reproduce, distribute, display, modify, transform, adapt, publicly perform, transmit, post, download, and/or otherwise use the materials you post or upload to the Website. Without limiting the generality of the foregoing, by posting, uploading, displaying, performing, transmitting, or otherwise distributing information or other content (“User Content”) to the Website, you grant JONDO, its affiliates, officers, directors, employees, consultants, agents, and representatives the license described above, including a license to use User Content in connection with the operation of the Internet business of JONDO, its affiliates, officers, directors, employees, consultants, agents, and representatives, including without limitation, a right to copy, distribute, transmit, publicly display, publicly perform, reproduce, edit, translate, and reformat User Content. You will not be compensated for any User Content. By posting User Content on the Website, you warrant and represent that you own the rights to the User Content, including, without limitation, all copyrights, trademarks, rights of publicity, and related rights or are otherwise authorized to post, upload, distribute, display, perform, transmit, or otherwise distribute User Content by express license of the owner thereof.
</p>
<H5>Customer Obligations</H5>
<p>
It is the submitting party's responsibility to submit orders with a deliverable address and images that conform to the specifications required for the products on the ordered.  Creating orders with undeliverable addresses or images that cannot be processed may result in the delay or cancellation of the order in question.  The submitting party accepts responsibility for the costs, if any, associated with an order that has entered production and is subsequently cancelled.
</p>
<H5>Color for Reference Only</H5>
<p>
The color samples for products on the Website should be used as a reference only in conjunction with the written descriptions. Due to the nature of color calibration, the colors on your monitor may differ from the actual product. To the extent permitted by applicable law, we do not warrant that the product descriptions, colors or other content available on the Website are complete, reliable, accurate current, or error-free.
</p>
<H5>Accuracy of Advice</H5>
<p>
JONDO does not represent or endorse the accuracy or reliability of any advice, opinion, statement, or other information displayed or distributed through the Website. You acknowledge that any reliance upon any such opinion, advice, statement, memorandum, or information shall be at your sole risk.
</p>
<H5>Intellectual Property Rights</H5>
<p>
The Website is protected by copyright as a literary work, audio-visual work, collective work and/or compilation, or a combination thereof, pursuant to U.S. copyright laws, international conventions, and treaties, and other copyright laws. All information and content contained on the Website, including, but not limited to trademarks, graphics, images, and logos are protected by US and international trademark laws, and are owned or controlled by JONDO or the party credited as the provider of the same. You will comply with any and all additional copyright notices, information, or restrictions contained in any content on the Website. The copying or storing of any and all content on the Website, including, text, graphics, photographs, images, data, audio-visual materials or sounds for other than personal or noncommercial use is expressly prohibited without the express written consent of JONDO or the copyright holder identified in the individual content’s copyright notice. The use of any trademarks displayed on the Website for commercial purposes without the express written consent of JONDO is strictly prohibited.
</p>
<H5>Changes to Website</H5>
<p>
JONDO may change, suspend or discontinue any aspect of the Website at any time, including the availability of any Website feature, database, or content. JONDO may also impose limits on certain features and services or restrict your access to parts or the entire Website without notice or liability.
</p>
<H5>Limited Use License</H5>
<p>
JONDO grants you a limited, revocable, and non-exclusive license to access and make personal, non-commercial use of the Website. This limited license does not include the right to: (1) frame or enclose the Website or any portion thereof; (2) republish, distribute, display, or sub-license the Website or any content thereon; and/or (3) create any derivative works based upon either the Website or any content thereon. This limited license may be terminated in JONDO’s sole discretion immediately upon any unauthorized use by you of the Website or any and/or all of JONDO’s content.
</p>
<H5>Sweepstakes; Contests; Promotions</H5>
<p>
JONDO may promote, via the Website, sweepstakes, contests or other types of promotions that will be governed by special rules in addition to these Terms. Your participation in such promotions constitutes acceptance of all applicable terms.
</p>
<H5>Prohibited Conduct</H5>
<p>
You represent, warrant and covenant that: (a) you shall not upload, post or transmit to, or distribute, or otherwise publish to or through the Website any materials which (i) restrict or inhibit any other user from using and enjoying the Website, (ii) are unlawful, threatening, abusive, libelous, or defamatory (iii) constitute or encourage conduct that would constitute a criminal offense, give rise to civil liability or otherwise violate law, (iv) violate, plagiarize or infringe the rights of third parties including, without limitation, copyright, trademark, patent, rights of privacy or publicity or any other proprietary right, (v) contain a virus or other harmful component, (vi) contain any information, software or other material of a commercial nature, (vii) contain advertising of any kind (i.e. Spam), or (viii) constitute or contain false or misleading indications of origin or statements of fact; (b) you will not redistribute content to anyone, nor will you permit any minor, or anyone who would find the content offensive, to view the content; and (c) you will not use or access the Website in any jurisdiction in which doing so would be unlawful.
</p>
<H5>Third Party Links</H5>
<p>
The Website may contain links and pointers to the other related World Wide Web Internet sites, resources, and sponsors of the Website. Links to and from Website to other third party sites, maintained by third parties, do not constitute an endorsement by Company or any of its subsidiaries or affiliates of any third party resources, or their contents. If you decide to access any of the third-party sites linked to the Website, you do so entirely at your own risk. All such websites are subject to the policies and procedures of the owner of such websites. Because we have no control over such websites or resources or the individuals who make such contributions, you acknowledge and agree that Company is not responsible for the availability of such websites or resources or any contributions, neither endorses nor is responsible or liable for any content, advertising, products or other materials on or available from such websites or resources or the content of any contributions and shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or resource.
</p>
<H5>Digital Millennium Copyright Notice</H5>
<p>
If you believe that specific content on the Website infringes upon your copyrighted materials, please provide JONDO with the following information: an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest; a description of the copyrighted work that you claim has been infringed; a description of where the allegedly infringing material is located on the Website, including the URL’s of the particular web pages; your address, telephone number, and email address; a written statement by you that you have a good faith belief that the use on the Website is not authorized by the copyright owner, its agent, or the law; a statement by you, made under penalty of perjury, that the foregoing information is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf. JONDO’s Designated Agent for copyright claims can be contacted as follows:
</p>
<p>
Roger N. Behle, Jr., Esq. FOLEY BEZEK BEHLE & CURTIS, LLP 575 Anton Boulevard, Suite 710 Costa Mesa, CA 92626
</p>
<H5>Disclaimer of Warranties</H5>
<p>
THE WEBSITE, INCLUDING ALL CONTENT, SOFTWARE, FUNCTIONS, MATERIALS, AND INFORMATION MADE AVAILABLE ON OR ACCESSED THROUGH THE WEBSITE, IS PROVIDED “AS IS.” TO THE FULLEST EXTENT PERMISSIBLE BY LAW, JONDO AND ITS SUBSIDIARIES AND AFFILIATES MAKE NO REPRESENTATION OR WARRANTIES OF ANY KIND WHATSOEVER FOR THE CONTENT ON THE WEBSITE OR THE MATERIALS, INFORMATION AND FUNCTIONS MADE ACCESSIBLE BY THE SOFTWARE USED ON OR ACCESSED THROUGH THE WEBSITE, FOR ANY PRODUCTS OR SERVICES OR HYPERTEXT LINKS TO THIRD PARTIES OR FOR ANY BREACH OF SECURITY ASSOCIATED WITH THE TRANSMISSION OF SENSITIVE INFORMATION THROUGH THE WEBSITE OR ANY LINKED SITE. FURTHER, JONDO AND ITS SUBSIDIARIES AND AFFILIATES DISCLAIM ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. JONDO DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED IN THE WEBSITE OR ANY MATERIALS OR CONTENT CONTAINED THEREIN WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE WEBSITE OR THE SERVER THAT MAKES IT AVAILABLE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. JONDO AND ITS SUBSIDIARIES AND AFFILIATES SHALL NOT BE LIABLE FOR THE USE OF THE WEBSITE, INCLUDING, WITHOUT LIMITATION, THE CONTENT AND ANY ERRORS CONTAINED THEREIN.
</p>
<H5>Idea Submissions</H5>
<p>
JONDO does not accept unsolicited suggestions and ideas. Any ideas, suggestions or other information you provide us will be treated as non-proprietary and non-confidential and treated as Communications, as defined above.
</p>
<H5>Indemnification</H5>
<p>
You hereby agree to indemnify, defend and hold JONDO, and all its officers, directors, owners, agents, employees, information providers, affiliates, licensors and licensees (collectively, the “Indemnified Parties”) harmless from and against any and all liability and costs incurred by the Indemnified Parties in connection with any claim arising out of any breach by you of the Terms including, without limitation, those set forth in the User Content and Prohibited Conduct sections hereof, as well as any and all of the foregoing representations, warranties and covenants, including, without limitation, attorneys’ fees and costs. You shall cooperate as fully as reasonably required in the defense of any claim. JONDO reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you and you shall not, in any event, settle any matter without the written consent of JONDO.
</p>
<H5>Governing Law</H5>
<p>
THIS AGREEMENT SHALL BE GOVERNED BY AND CONSTRUED IN ACCORDANCE WITH THE LAWS OF THE STATE OF CALIFORNIA, WITHOUT REGARD TO CONFLICTS OF LAWS PROVISIONS. SOLE AND EXCLUSIVE JURISDICTION FOR ANY ACTION OR PROCEEDING ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE AN APPROPRIATE STATE OR FEDERAL COURT LOCATED IN THE STATE OF CALIFORNIA, COUNTY OF ORANGE.
</p>
<H5>Entire Agreement</H5>
<p>
This Agreement constitutes the entire agreement between JONDO and you with respect to your use of the Website. If for any reason a court of competent jurisdiction finds any provision of the Agreement, or portion thereof, to be unenforceable, that provision shall be enforced to the maximum extent permissible so as to affect the intent of the Agreement, and the remainder of this Agreement shall continue in full force and effect.
</p>
`

class Skip extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      error: ''
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  async handleSkip(e) {
    e.preventDefault();

    const { nextStage, score, curStage, orderOrigin } = this.props;
    

    /*
    //const sectionStatus = "Skipped";
    const response = await axios.post(
      process.env.REACT_APP_JONDO_API + process.env.REACT_APP_UPDATE_PORTAL_STATUS,
      { userName, sectionName, sectionStatus, curStage, curPage, percentage },
      { headers: { 'Authorization': 'Bearer ' + jwt } }
    );
    */

    //if (response.data.error) {
    //  this.setState({ error: response.data.error });
    //} else {
      if (curStage === "status") {
        this.props.handleGoLive("Skipped");
      } else {
        this.props.handleSkip(nextStage, score, orderOrigin);
      }
    //}
  }

  render() {
    // let alert = '';

    // if (this.state.error !== '') {
    //   alert = <Alert variant='dark'>
    //     {this.state.error}
    //   </Alert>
    // }

    return (
      <div className="Skip">
        

        {this.props.asUser
        ? ''
        : <Button size="lg" variant="outline-dark" className="mx-3" onClick={() => this.handleShow()}>SKIP</Button>
        }

        {/*
        <Button size="lg" variant="outline-dark" className="mx-3" onClick={() => this.handleShow()}>SKIP</Button>
        */}
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
          <Modal.Title> Confirmation <br></br>
          <p className="title-header">
          We highly recommend that you do not skip this section of the API on-boarding process to ensure that all obvious issues, should they occur, are found and fixed before moving into production. If you choose to skip this part of the API on-boarding process, please read the terms and conditions noted below and select Yes after signing the agreement box. Please keep in mind that by skipping this section of the API Test Plan, you hereby agree to be solely responsible for any expenses arising from forgoing this part of the API on-boarding process.</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className = "scroll" >
            <p dangerouslySetInnerHTML={{__html: TNC}}   ></p>

            <Form onSubmit={this.handleSkip}>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" required />
                <label className="form-check-label">I agree to the terms and conditions listed above.</label>
              </div>
              <Row>
                <Button type='submit' variant="primary" className="mx-auto">
                  Yes
                </Button>
              </Row>
            </Form>

            {/* {alert} */}

          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleSkip: (nextStage, score, orderOrigin) => dispatch(handleSkip(nextStage, score, orderOrigin)),
  handleGoLive: (sectionStatus) => dispatch(handleGoLive(sectionStatus))
});

const mapStateToProps = state => (
  {
    curStage: state.handler.curStage,
    curPage: state.handler.curPage,
    userName: state.session.userName,
    asUser: state.session.asUser,
    percentage: state.handler.progress,
    jwt: state.session.jwt,
    orderOrigin: state.session.orderOrigin
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Skip);
