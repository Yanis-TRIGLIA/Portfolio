import ImageTool from '@editorjs/image';

type ImageToolData = {
  caption: string;
  withBorder: boolean;
  withBackground: boolean;
  stretched: boolean;
  file: {
    url: string;
  };
  alt?: string; 
};

export default class CustomImageTool extends ImageTool {
  private alt: string; 

  constructor({ data, config, api, readOnly, block }: any) {
    super({ data, config, api, readOnly, block });
    this.alt = data.alt || ''; 
}


  render() {
    const wrapper = super.render(); 


    const altInput = document.createElement('input');
    altInput.placeholder = 'Ajouter le Alt';
    altInput.classList.add('image-alt-input');
    altInput.type = 'text';
    altInput.value = this.alt; 


    altInput.addEventListener('input', (event) => {
      this.alt = (event.target as HTMLInputElement).value; 
    });

    wrapper.appendChild(altInput); 

    return wrapper;
  }

  save() {
    const data = super.save() as ImageToolData; 
    data.alt = this.alt || ''; 
    return data;
  }


}
