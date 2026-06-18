 
import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const normalizeChartData = (chartData) => {
  if (chartData === undefined || chartData === null) return []

  if (typeof chartData === 'string') {
    try {
      chartData = JSON.parse(chartData)
    } catch {
      // Fall through, treat as raw string if parse fails
    }
  }

  if (Array.isArray(chartData)) {
    return chartData
      .map((item, index) => {
        if (item && typeof item === 'object') {
          const name = item.name ?? item.label ?? item.key ?? `Item ${index + 1}`
          const value = Number(item.value ?? item.count ?? item.y ?? item.x ?? 0)
          return { name, value }
        }

        if (typeof item === 'number') {
          return { name: `Item ${index + 1}`, value: item }
        }

        if (typeof item === 'string') {
          const parsed = Number(item)
          return { name: `Item ${index + 1}`, value: Number.isNaN(parsed) ? item : parsed }
        }

        return null
      })
      .filter(Boolean)
  }

  if (chartData && typeof chartData === 'object') {
    if (Array.isArray(chartData.labels) && Array.isArray(chartData.values)) {
      return chartData.labels.map((label, idx) => ({
        name: String(label),
        value: Number(chartData.values[idx] ?? 0),
      }))
    }

    if ('name' in chartData && 'value' in chartData) {
      return [{ name: String(chartData.name), value: Number(chartData.value) }]
    }

    return Object.entries(chartData).map(([name, value]) => ({
      name,
      value: Number(value ?? 0),
    }))
  }

  return []
}

const RechartSetUp = ({ charts }) => {
  if (!charts || charts.length === 0) return null

  const COLORS = ['#6366f1', '#22c55e', '#ef4444', '#06b6d4']

  return (
    <div className='space-y-8'>
      {charts.map((chart, index) => {
        const type = String(chart?.type ?? '').toLowerCase()
        const data = normalizeChartData(chart?.data)
        const title = chart?.title ?? `Chart ${index + 1}`

        return (
          <div key={index} className='border border-gray-200 rounded-xl p-4 bg-white'>
            <h4 className='font-semibold text-gray-800 mb-3'>
              📊 {title}
            </h4>

            <div className='h-72'>
              <ResponsiveContainer width='100%' height='100%'>
                {data.length === 0 ? (
                  <div className='text-sm text-gray-400'>No chart data available</div>
                ) : (
                  <>
                    {type === 'bar' && (
                      <BarChart data={data}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey='value' radius={[6, 6, 0, 0]}>
                          {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}

                    {type === 'line' && (
                      <LineChart data={data}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Line type='monotone' dataKey='value' stroke='#6366f1' strokeWidth={3} />
                      </LineChart>
                    )}

                    {type === 'pie' && (
                      <PieChart>
                        <Tooltip />
                        <Pie data={data} dataKey='value' nameKey='name' outerRadius={100} label>
                          {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    )}
                  </>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )
      })}
    </div>
  )
}

 

export default RechartSetUp
