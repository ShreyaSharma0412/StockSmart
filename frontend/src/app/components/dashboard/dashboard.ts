import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Product, StockTransaction, PurchaseOrder } from '../../models/inventory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-page">
      
      <!-- Header Hero Section -->
      <section class="hero-section">
        <div class="hero-text">
          <div class="tagline">SMARTER RETAIL. BETTER DECISIONS.</div>
          <h1 class="headline">Your business, <span class="highlight-green">at a glance.</span></h1>
          <p class="description">Real-time insights. Track performance, optimise operations, grow with confidence.</p>
        </div>

        <!-- Floating Green Insight Cards -->
        <div class="insight-cards-row">
          <div class="insight-card main-insight">
            <div class="i-badge">⚡ AI Insight <span>↗</span></div>
            <div class="i-title">Your stock turnover grew</div>
            <div class="i-val">24% <span class="i-sub">this month</span></div>
            <div class="i-footer">Keep up the momentum!</div>
          </div>

          <div class="insight-card mini-insight">
            <div class="i-badge">↗</div>
            <div class="i-label">Expenses</div>
            <div class="i-status">optimized</div>
          </div>

          <div class="insight-card mini-insight">
            <div class="i-badge">↗</div>
            <div class="i-val-sm">5 new</div>
            <div class="i-status">opportunities</div>
          </div>
        </div>
      </section>

      <!-- 4 Top KPI Summary Cards Grid -->
      <section class="kpi-grid">
        <!-- Card 1: Total Revenue / Value -->
        <div class="kpi-card glass-card">
          <div class="card-head">
            <span class="c-title">Total Revenue</span>
            <span class="dots">•••</span>
          </div>
          <div class="c-value">\${{ (kpiSummary?.totalInventoryValue || 48750) | number:'1.0-0' }}</div>
          <div class="c-trend green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
            <span>↑ 18.6% vs last month</span>
          </div>
          <!-- Sparkline SVG -->
          <div class="sparkline-wrap">
            <svg viewBox="0 0 200 40" class="sparkline">
              <path d="M0,35 Q40,25 80,30 T160,10 T200,15 L200,40 L0,40 Z" fill="rgba(16, 185, 129, 0.12)"/>
              <path d="M0,35 Q40,25 80,30 T160,10 T200,15" fill="none" stroke="#10b981" stroke-width="2.5"/>
            </svg>
          </div>
        </div>

        <!-- Card 2: Active Clients / SKUs -->
        <div class="kpi-card glass-card">
          <div class="card-head">
            <span class="c-title">Active SKUs</span>
            <span class="dots">•••</span>
          </div>
          <div class="c-value">{{ products.length || 1248 }}</div>
          <div class="c-trend green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
            <span>↑ 12.4% vs last month</span>
          </div>
          <!-- Bar Graph Sparkline -->
          <div class="bars-wrap">
            <span style="height:40%"></span>
            <span style="height:60%"></span>
            <span style="height:30%"></span>
            <span style="height:80%"></span>
            <span style="height:50%"></span>
            <span style="height:90%" class="active"></span>
          </div>
        </div>

        <!-- Card 3: Stock Status Donut -->
        <div class="kpi-card glass-card">
          <div class="card-head">
            <span class="c-title">Stock Status</span>
            <span class="dots">•••</span>
          </div>
          <div class="donut-wrapper">
            <div class="donut-chart">
              <span class="donut-num">78%</span>
              <span class="donut-lbl">Optimal</span>
            </div>
            <div class="legend">
              <div><span class="dot-lg g"></span> In Stock (78%)</div>
              <div><span class="dot-lg a"></span> Low Stock (16%)</div>
              <div><span class="dot-lg r"></span> Out of Stock (6%)</div>
            </div>
          </div>
        </div>

        <!-- Card 4: Cash Flow -->
        <div class="kpi-card glass-card">
          <div class="card-head">
            <span class="c-title">Reorder Cash Flow</span>
            <span class="dots">•••</span>
          </div>
          <div class="c-value">\$24,980</div>
          <div class="c-trend green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
            <span>↑ 8.2% vs last month</span>
          </div>
          <div class="bars-wrap">
            <span style="height:50%"></span>
            <span style="height:70%"></span>
            <span style="height:40%"></span>
            <span style="height:85%"></span>
            <span style="height:65%"></span>
            <span style="height:100%" class="active"></span>
          </div>
        </div>
      </section>

      <!-- Main Content Layout (3 Columns) -->
      <section class="middle-layout">
        
        <!-- Left: Revenue vs Expenses Dual Line Chart -->
        <div class="chart-card glass-card">
          <div class="chart-header">
            <div>
              <h3>Stock Movement vs Sales</h3>
              <div class="sub-legend">
                <span class="l-item"><span class="l-dot green"></span> Sales</span>
                <span class="l-item"><span class="l-dot gray"></span> Restocks</span>
              </div>
            </div>
            <select class="form-input time-select" [(ngModel)]="selectedPeriod" (change)="onPeriodChange()">
              <option value="This Year">This Year</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <!-- Chart Area SVG -->
          <div class="chart-svg-wrap">
            <svg viewBox="0 0 500 180" class="line-chart">
              <!-- Grid Lines -->
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" stroke-width="1"/>

              <!-- Dynamic Green Line (Sales) -->
              <path [attr.d]="getSalesSvgPath()" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
              <!-- Dynamic Gray Line (Restocks) -->
              <path [attr.d]="getRestocksSvgPath()" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4" stroke-linecap="round"/>

              <!-- Dynamic Points -->
              <g *ngFor="let pt of getPoints()">
                <!-- Restock Circle -->
                <circle [attr.cx]="pt.x" [attr.cy]="pt.restocksY" r="4" fill="#94a3b8"/>
                <!-- Sales Circle -->
                <circle 
                  [attr.cx]="pt.x" 
                  [attr.cy]="pt.salesY" 
                  r="5" 
                  fill="#10b981" 
                  stroke="#ffffff" 
                  stroke-width="2" 
                  class="chart-point"
                  (mouseenter)="hoveredPoint = { label: pt.label, sales: pt.sales, restocks: pt.restocks, x: pt.x, y: pt.salesY }"
                  (mouseleave)="hoveredPoint = null">
                </circle>
              </g>

              <!-- Tooltip Box -->
              <g *ngIf="hoveredPoint">
                <rect 
                  [attr.x]="hoveredPoint.x > 380 ? hoveredPoint.x - 110 : hoveredPoint.x + 10" 
                  [attr.y]="hoveredPoint.y - 35" 
                  width="105" 
                  height="42" 
                  rx="6" 
                  fill="#0f172a" 
                  opacity="0.95"/>
                <text 
                  [attr.x]="hoveredPoint.x > 380 ? hoveredPoint.x - 55 : hoveredPoint.x + 62" 
                  [attr.y]="hoveredPoint.y - 20" 
                  text-anchor="middle" 
                  fill="#ffffff" 
                  font-size="9" 
                  font-weight="bold">
                  {{ hoveredPoint.label }}: \${{ hoveredPoint.sales | number }}
                </text>
                <text 
                  [attr.x]="hoveredPoint.x > 380 ? hoveredPoint.x - 55 : hoveredPoint.x + 62" 
                  [attr.y]="hoveredPoint.y - 6" 
                  text-anchor="middle" 
                  fill="#94a3b8" 
                  font-size="8">
                  Restocks: \${{ hoveredPoint.restocks | number }}
                </text>
              </g>
            </svg>
            <div class="chart-x-labels">
              <span *ngFor="let lbl of chartData.labels">{{ lbl }}</span>
            </div>
          </div>
        </div>

        <!-- Middle Vertical KPI Stack -->
        <div class="metrics-stack">
          <div class="mini-kpi-card glass-card">
            <span class="m-lbl">Total Inventory</span>
            <div class="m-val">\$285,640</div>
            <div class="m-sub green">↑ 16.2% vs last year</div>
          </div>

          <div class="mini-kpi-card glass-card">
            <span class="m-lbl">Total Expenses</span>
            <div class="m-val">\$186,430</div>
            <div class="m-sub green">↑ 9.8% vs last year</div>
          </div>

          <div class="mini-kpi-card glass-card highlight-green-bg">
            <span class="m-lbl">Net Profit Margin</span>
            <div class="m-val green-text">\$99,210</div>
            <div class="m-sub green">↑ 21.5% vs last year</div>
          </div>
        </div>

        <!-- Right: AI Assistant Interactive Chat Widget -->
        <div class="ai-assistant-card glass-card">
          <div class="ai-header">
            <div class="ai-title">
              <span class="sparkle">✨</span>
              <h3>AI Assistant</h3>
            </div>
            <span class="expand-icon">⤢</span>
          </div>

          <!-- Chat Conversation -->
          <div class="chat-messages">
            <!-- User Message -->
            <div class="msg-row user">
              <div class="avatar">JL</div>
              <div class="msg-bubble">
                <div class="msg-sender">Jordan Lee <span class="time">10:24 AM</span></div>
                <div class="msg-text">Can you analyze last month's inventory turnover and suggest areas to improve?</div>
              </div>
            </div>

            <!-- AI Message -->
            <div class="msg-row ai">
              <div class="avatar ai-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
              </div>
              <div class="msg-bubble">
                <div class="msg-sender">StockSmart AI <span class="time">10:24 AM</span></div>
                <div class="msg-text">Sure! Here are 3 key opportunities:</div>
                
                <div class="ai-suggestions-list">
                  <div class="sug-item">
                    <span class="num">1</span>
                    <span>Increase safety stock for high-demand coffee beans (<strong>+12% potential</strong>)</span>
                  </div>
                  <div class="sug-item">
                    <span class="num">2</span>
                    <span>Automate PO reorders for low-stock coconut oil (<strong>-$2,400/month save</strong>)</span>
                  </div>
                  <div class="sug-item">
                    <span class="num">3</span>
                    <span>Focus optimization on high-performing tech hardware (<strong>+18% growth</strong>)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Tags & Input -->
          <div class="chat-actions">
            <div class="tags-row">
              <button class="tag-btn" (click)="chatPrompt('Show active products catalog')">📁 Products</button>
              <button class="tag-btn" (click)="chatPrompt('Analyze turnover chart')">📊 Charts</button>
              <button class="tag-btn" (click)="chatPrompt('Generate low stock report')">📄 Reports</button>
            </div>
            
            <div class="input-send-box">
              <input 
                type="text" 
                [(ngModel)]="userPrompt" 
                (keyup.enter)="sendChat()" 
                placeholder="Ask StockSmart AI anything..." 
                class="chat-input">
              <button class="send-btn" (click)="sendChat()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

        </div>

      </section>

      <!-- Bottom Layout Grid -->
      <section class="bottom-layout">
        <!-- Category Progress Ring -->
        <div class="progress-card glass-card">
          <h3>Category Stock Ratio</h3>
          <div class="progress-ring-box">
            <div class="p-ring">
              <span class="p-val">72%</span>
              <span class="p-lbl">Optimal</span>
            </div>
            <div class="p-breakdown">
              <div><span class="dot-lg g"></span> Pantry & Gourmet (72%)</div>
              <div><span class="dot-lg a"></span> Personal Care (18%)</div>
              <div><span class="dot-lg r"></span> Eco Home (10%)</div>
            </div>
          </div>
        </div>

        <!-- Upcoming Reorder Tasks -->
        <div class="tasks-card glass-card">
          <div class="t-head">
            <h3>☑ Upcoming Tasks</h3>
            <span class="view-all">View All ↗</span>
          </div>
          <div class="task-list">
            <div class="task-item">
              <input type="checkbox" checked id="t1">
              <label for="t1" class="done">PO #78912 Sent - EcoGoods Inc.</label>
              <span class="t-time">Today, 2:00 PM</span>
            </div>
            <div class="task-item">
              <input type="checkbox" id="t2">
              <label for="t2">PO #78905 In Transit - ETA 3 days</label>
              <span class="t-time">Tomorrow, 10:00 AM</span>
            </div>
            <div class="task-item">
              <input type="checkbox" id="t3">
              <label for="t3">Team RFID Hardware Audit</label>
              <span class="t-time">Fri, 11:00 AM</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 32px 40px;
      max-width: 1540px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    /* Hero Section */
    .hero-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .tagline {
      font-size: 0.75rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .headline {
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    .highlight-green {
      color: #10b981;
    }
    .description {
      font-size: 0.9rem;
      color: #64748b;
      margin-top: 6px;
    }

    /* Floating Insight Cards */
    .insight-cards-row {
      display: flex;
      gap: 16px;
    }
    .insight-card {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      border-radius: 16px;
      padding: 16px 20px;
      color: #065f46;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 170px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
    }
    .main-insight {
      min-width: 220px;
    }
    .i-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: #047857;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .i-title {
      font-size: 0.8rem;
      margin-top: 6px;
    }
    .i-val {
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1.1;
    }
    .i-val-sm {
      font-size: 1.25rem;
      font-weight: 800;
      margin-top: 8px;
    }
    .i-sub {
      font-size: 0.75rem;
      font-weight: 500;
    }
    .i-footer {
      font-size: 0.725rem;
      font-weight: 600;
      margin-top: 4px;
    }
    .i-label {
      font-size: 0.8rem;
      margin-top: 8px;
    }
    .i-status {
      font-weight: 700;
      font-size: 0.9rem;
    }

    /* KPI Summary Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .kpi-card {
      padding: 20px 22px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .c-title {
      font-size: 0.825rem;
      font-weight: 600;
      color: #64748b;
    }
    .dots {
      color: #cbd5e1;
      cursor: pointer;
    }
    .c-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .c-trend {
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }
    .c-trend.green { color: #10b981; }

    .sparkline-wrap {
      margin-top: 12px;
    }
    .sparkline {
      width: 100%;
      height: 40px;
    }
    .bars-wrap {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 40px;
      margin-top: 12px;
    }
    .bars-wrap span {
      flex: 1;
      background: #e2e8f0;
      border-radius: 4px;
    }
    .bars-wrap span.active {
      background: #10b981;
    }

    /* Donut chart inside KPI */
    .donut-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
    }
    .donut-chart {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: conic-gradient(#10b981 0% 78%, #f59e0b 78% 94%, #ef4444 94% 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .donut-chart::before {
      content: '';
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #ffffff;
      position: absolute;
    }
    .donut-num {
      position: relative;
      z-index: 1;
      font-size: 0.75rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .donut-lbl {
      position: relative;
      z-index: 1;
      font-size: 0.6rem;
      color: #64748b;
    }
    .legend {
      font-size: 0.725rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: #475569;
    }
    .dot-lg {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot-lg.g { background: #10b981; }
    .dot-lg.a { background: #f59e0b; }
    .dot-lg.r { background: #ef4444; }

    /* Middle Layout */
    .middle-layout {
      display: grid;
      grid-template-columns: 1fr 220px 380px;
      gap: 20px;
    }
    .chart-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .chart-header h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
    }
    .sub-legend {
      display: flex;
      gap: 16px;
      font-size: 0.75rem;
      margin-top: 4px;
    }
    .l-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
    }
    .l-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .l-dot.green { background: #10b981; }
    .l-dot.gray { background: #94a3b8; }

    .time-select {
      padding: 4px 10px;
      font-size: 0.8rem;
    }
    .chart-svg-wrap {
      width: 100%;
    }
    .line-chart {
      width: 100%;
      height: 140px;
    }
    .chart-x-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
      padding: 0 10px;
      margin-top: 8px;
    }

    /* Middle Metrics Stack */
    .metrics-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .mini-kpi-card {
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .m-lbl {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }
    .m-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
    }
    .m-sub {
      font-size: 0.725rem;
      font-weight: 700;
    }
    .m-sub.green { color: #10b981; }
    .highlight-green-bg {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .green-text {
      color: #047857;
    }

    /* AI Assistant Chat Widget */
    .ai-assistant-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
    }
    .ai-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sparkle {
      color: #10b981;
    }
    .ai-header h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }
    .expand-icon {
      color: #94a3b8;
      cursor: pointer;
    }

    .chat-messages {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-height: 260px;
      overflow-y: auto;
      margin-bottom: 14px;
    }
    .msg-row {
      display: flex;
      gap: 10px;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #475569;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ai-avatar {
      background: #10b981;
      color: #ffffff;
    }
    .msg-bubble {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 0.8rem;
    }
    .msg-sender {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .time {
      font-weight: 400;
      color: #94a3b8;
      font-size: 0.7rem;
      margin-left: 6px;
    }
    .msg-text {
      color: #334155;
      line-height: 1.4;
    }
    .ai-suggestions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .sug-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      font-size: 0.775rem;
      color: #1e293b;
    }
    .sug-item .num {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.65rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tags-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .tag-btn {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 0.725rem;
      font-weight: 600;
      cursor: pointer;
    }
    .tag-btn:hover {
      background: #10b981;
      color: #ffffff;
    }
    .input-send-box {
      display: flex;
      gap: 8px;
    }
    .chat-input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      font-size: 0.8rem;
      outline: none;
    }
    .send-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* Bottom Layout */
    .bottom-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .progress-card, .tasks-card {
      padding: 24px;
    }
    .progress-card h3, .t-head h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }
    .progress-ring-box {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 16px;
    }
    .p-ring {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: conic-gradient(#10b981 0% 72%, #f59e0b 72% 90%, #ef4444 90% 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .p-ring::before {
      content: '';
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #ffffff;
      position: absolute;
    }
    .p-val {
      position: relative;
      z-index: 1;
      font-weight: 800;
      font-size: 0.9rem;
      color: #0f172a;
    }
    .p-lbl {
      position: relative;
      z-index: 1;
      font-size: 0.65rem;
      color: #64748b;
    }
    .p-breakdown {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.8rem;
      color: #475569;
    }
    .t-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .view-all {
      font-size: 0.8rem;
      color: #10b981;
      font-weight: 600;
      cursor: pointer;
    }
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .task-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
    }
    .task-item label {
      flex: 1;
      color: #1e293b;
    }
    .task-item label.done {
      text-decoration: line-through;
      color: #94a3b8;
    }
    .t-time {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private cdr = inject(ChangeDetectorRef);

  kpiSummary: any = null;
  products: Product[] = [];
  transactions: StockTransaction[] = [];
  orders: PurchaseOrder[] = [];
  userPrompt = '';

  selectedPeriod = 'This Year';
  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    sales: [14200, 18500, 24100, 21800, 29400, 34500],
    restocks: [8500, 12000, 15400, 11200, 18900, 21000]
  };

  hoveredPoint: { label: string; sales: number; restocks: number; x: number; y: number } | null = null;

  ngOnInit() {
    this.inventoryService.getKpiSummary().subscribe(kpi => {
      this.kpiSummary = kpi;
      this.cdr.markForCheck();
    });
    this.inventoryService.getProducts().subscribe(p => {
      this.products = p;
      this.cdr.markForCheck();
    });
    this.inventoryService.getTransactions().subscribe(t => {
      this.transactions = t;
      this.cdr.markForCheck();
    });
    this.inventoryService.getPurchaseOrders().subscribe(o => {
      this.orders = o;
      this.cdr.markForCheck();
    });
  }

  onPeriodChange() {
    if (this.selectedPeriod === 'This Year') {
      this.chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        sales: [14200, 18500, 24100, 21800, 29400, 34500],
        restocks: [8500, 12000, 15400, 11200, 18900, 21000]
      };
    } else if (this.selectedPeriod === 'Last Quarter') {
      this.chartData = {
        labels: ['Apr', 'May', 'Jun'],
        sales: [21800, 29400, 34500],
        restocks: [11200, 18900, 21000]
      };
    } else { // This Month
      this.chartData = {
        labels: ['W1', 'W2', 'W3', 'W4'],
        sales: [7500, 8900, 9200, 8900],
        restocks: [4200, 5100, 6000, 5700]
      };
    }
    this.cdr.markForCheck();
  }

  getSalesSvgPath(): string {
    const data = this.chartData.sales;
    const maxVal = Math.max(...data, ...this.chartData.restocks, 1);
    const width = 440;
    const height = 110;
    const step = width / (data.length - 1 || 1);
    
    return data.map((val, idx) => {
      const x = 30 + idx * step;
      const y = 140 - (val / maxVal) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  getRestocksSvgPath(): string {
    const data = this.chartData.restocks;
    const maxVal = Math.max(...this.chartData.sales, ...data, 1);
    const width = 440;
    const height = 110;
    const step = width / (data.length - 1 || 1);
    
    return data.map((val, idx) => {
      const x = 30 + idx * step;
      const y = 140 - (val / maxVal) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  getPoints() {
    const salesData = this.chartData.sales;
    const restockData = this.chartData.restocks;
    const maxVal = Math.max(...salesData, ...restockData, 1);
    const width = 440;
    const height = 110;
    const step = width / (salesData.length - 1 || 1);

    return salesData.map((val, idx) => ({
      label: this.chartData.labels[idx],
      sales: val,
      restocks: restockData[idx],
      x: 30 + idx * step,
      salesY: 140 - (val / maxVal) * height,
      restocksY: 140 - (restockData[idx] / maxVal) * height
    }));
  }

  chatPrompt(prompt: string) {
    this.userPrompt = prompt;
    this.sendChat();
  }

  sendChat() {
    if (!this.userPrompt.trim()) return;
    this.userPrompt = '';
    this.cdr.markForCheck();
  }
}
