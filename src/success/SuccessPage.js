import React from 'react';
import './SuccessPage.css'; // Assuming you move the CSS into a separate file

function SuccessPage() {
  return (
    <div className="success-container">
      <h1>Processing Complete</h1>
      <p>Your document has been processed successfully and saved!</p>

      {/* Button for Azure Blob Storage */}
      <a
        href="https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2F04cc0711-48e2-41a6-a1fd-3fefa6e37a6a%2FresourceGroups%2FDataBricks%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fmhccnadata/path/mhccnacontainer/etag/%220x8DCC6CD602DA7CC%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride~/false/defaultId//publicAccessVal/None"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-custom"
      >
        Go to Azure
      </a>

      {/* Button for Salesforce Org */}
      <a
        href="https://login.salesforce.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-custom"
      >
        Go to Salesforce
      </a>

      {/* Button to return to Home */}
      <a href="/" className="btn btn-home">
        Return to Home
      </a>
    </div>
  );
}

export default SuccessPage;