import * as React from 'react';
import Dropzone from 'react-dropzone-component';
import { FileUploadWrapper } from './style';

export class FileUpload extends React.Component<any, any> {

  djsConfig = null;
  componentConfig = null;
  success = null;
  removedfile = null;
  dropzone = null;

  constructor(props) {
    super(props);

    this.djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg, image/png, image/gif',
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: '/uploadHandler',
    };

    this.success = file => console.log('uploaded', file);
    this.removedfile = file => console.log('removing...', file);

    this.dropzone = null;

  }

  render() {

    const eventHandlers = {
      init: dz => this.dropzone = dz,
      success: this.success,
      removedfile: this.removedfile,
    };

    return (
      <FileUploadWrapper>
        <Dropzone
          config={this.componentConfig}
          djsConfig={this.djsConfig}
          eventHandlers={eventHandlers}
        />
       </FileUploadWrapper>
    );
  }
}
