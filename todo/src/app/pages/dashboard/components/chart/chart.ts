import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart as ChartJS, Plugin } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  imports: [],
  template: `<canvas #chartCanvas></canvas>`,
  styleUrl: './chart.scss'
})
export class Chart implements AfterViewInit {
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;

  chart!: ChartJS;

  ngAfterViewInit() {
    const greyBackgroundPlugin: Plugin<'bar'> = {
      id: 'greyBackground',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, chart.width!, chart.height!);
        ctx.restore();
      }
    };

    this.chart = new ChartJS(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Progress'],
        datasets: [{
          backgroundColor: '#249DD6',
          barPercentage: 0.9,
          categoryPercentage: 1,
          data: [25]
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            min: 0,
            max: 100
          },
          y: {
            display: false
          }
        }
      }, plugins: [greyBackgroundPlugin]
    });
  }
}