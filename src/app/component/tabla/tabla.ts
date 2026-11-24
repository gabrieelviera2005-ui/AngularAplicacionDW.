import { Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

interface TablaColumn {
  key: string;
  header: string;
}

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-tabla',
  styleUrl: './tabla.css',
  templateUrl: './tabla.html',
})
export class Tabla {
  data = input<Record<string, unknown>[]>([]);
  columns = input<TablaColumn[]>([]);
  actionTemplate = input<TemplateRef<any> | null>(null);
}
