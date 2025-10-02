import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart as ChartJS, Plugin } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  imports: [],
  template: `<canvas #chartCanvas></canvas>`,
  styleUrl: './chart.scss'
})
export class Chart implements AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() tasksDone: number = 0;
  @Input() tasksLeft: number = 0;
  @Input() tasksNeeded: number = 10;

  chart!: ChartJS;

  ngAfterViewInit() {
    const greyBackgroundPlugin: Plugin<'bar'> = {
      id: 'greyBackground',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = '#FFF0FD';
        ctx.fillRect(0, 0, chart.width!, chart.height!);
        ctx.restore();
      }
    };

    this.chart = new ChartJS(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [''],
        datasets: [{
          backgroundColor: ['#E19DE3'],
          barPercentage: 0.8,
          categoryPercentage: 1,
          data: [this.tasksDone]
        }]
      },
      options: {
        responsive: true,      
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            min: 0,
            max: Math.max(this.tasksDone + this.tasksLeft, this.tasksNeeded)
          },
          y: {
            display: true
          }
        }
      }, 
      plugins: [greyBackgroundPlugin]
    });
  }
}