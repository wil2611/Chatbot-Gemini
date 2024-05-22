import {
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
} from '@angular/fire/firestore';
import { MarkdownComponent } from 'ngx-markdown';
enum Status {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Complete = 'COMPLETED',
  Errored = 'ERRORED'
}
enum MessageType {
  Prompt = 'PROMPT',
  Response ='RESPONSE'
}
interface DisplayMessage {
  text: string;
  type: MessageType;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgClass,
    MarkdownComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent { 
  promptText = new FormControl('');
 status = Status.Pending;
 errorMsg = '';

 responses: WritableSignal<DisplayMessage[]> = signal([
   {
     text: "¡Hola!, ¿Cómo puedo ayudarte hoy?",
     type: MessageType.Response
   }
 ]);
 private changeDetectorRef = inject(ChangeDetectorRef);


 private readonly firestore: Firestore = inject(Firestore);
 private readonly conversationsCollection = collection(this.firestore, 'conversations');
 
 constructor() { }

 async sendMessage(ev: Event) {
   ev.preventDefault();
   this.scrollToBottom();
 
   if (!this.promptText.value) return;

   const prompt = this.promptText.value;
   if(!prompt) {
     return;
   }

   this.status = Status.Processing;

   this.responses.update(responses => [...responses,{text: prompt,
     type: MessageType.Prompt
   }])

   this.promptText.setValue('');

   const docRef = await addDoc(this.conversationsCollection, { prompt });

   const destroyFn = onSnapshot(docRef, {
     next: snap => {
       const conversation = snap.data();
       if (conversation && conversation['status']) {
         const state = conversation['status']['state'];

         switch (state) {
           case Status.Complete:
             this.status = Status.Complete;
             this.responses.update(responses => [...responses,{
               text: conversation['response'],
               type: MessageType.Response,
             }])

             this.status = Status.Complete;
             this.changeDetectorRef.detectChanges();
             destroyFn();

             break;
           case Status.Processing:
             // You can add something here in this state if you need it
             break;
           case Status.Errored:
             this.status = Status.Errored;
             destroyFn();
             break;
         }
         this.scrollToBottom();
       }
     },
     error: err => {
       this.errorMsg = err.message;
       destroyFn();
       this.scrollToBottom();
     }
   })
 }
 scrollToBottom() {
  // Use setTimeout to allow DOM updates before scrolling
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 0);
 }
}


