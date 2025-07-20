import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    Hello, My Name is Abdullah Al Nomaan.
    I'm a 3+ Years for experiences Full-stack Software Engineer. If you need any help please don't hesitate to get in touch.
    Mail:abdullahalnomaan77@gmail.com 
    `;
  }
}
