import React from 'react';

import '../../assets/css/ResourceViewer.css'

const ResourceViewer = ({ resource, title }) => {

  const renderResource = () => {
    const url = resource.url;

    if (resource.type === 'video') {
        return (
            <div className="responsive-iframe">
            <iframe
              src={url}
              frameBorder="0"
              allowFullScreen
              title={title}
            ></iframe>
            </div>
          );
    }

    if (resource.type === 'powerpoint') {
        return <iframe 
            src={resource.url} 
            width="510" 
            height="407" 
            title={title}
            ></iframe>;
    }

    return null;
  };

  return <>{renderResource()}</>;
};

export default ResourceViewer;
