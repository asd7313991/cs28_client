<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Toast } from 'tdesign-mobile-vue'
import TableBetCell from './TableBetCell.vue'

interface Item { play: string; name: string; odds: number }
const props = defineProps<{
  items: Item[]
  locked?: boolean    // ✅ 新增：是否封盘；默认 false
}>()

defineEmits<{ (e: 'close'): void; (e: 'help'): void }>()

const disabled = computed(() => !!props.locked)   // ✅ 不再依赖 store

const tab = ref<'hot'|'num'>('hot')

const get = (names: string[]) =>
  names.map(n => props.items.find(x => x.name === n)).filter(Boolean) as Item[]

const majorRow1 = computed(() => get(['大', '小']))
const majorRow2 = computed(() => get(['单', '双']))
const comboRow  = computed(() => get(['大单', '大双', '小单', '小双']))
const beastRow1 = computed(() => get(['极大', '龙', '虎', '豹']))
const beastRow2 = computed(() => get(['极小', '对子', '顺子', '豹子']))
const numberPlays = computed(() =>
  props.items.filter(i => /^\d+$/.test(i.name)).sort((a,b)=>Number(a.name)-Number(b.name))
)

const chips = [1,5,10,50,100,500]
const currentChip = ref(5)
const picked = reactive<Record<string, number>>({})

function add(o: Item) {
  if (disabled.value) return
  picked[o.play] = (picked[o.play] || 0) + currentChip.value
}

function clear(){ Object.keys(picked).forEach(k => delete picked[k]) }
const betCount = computed(() => Object.keys(picked).length)
const betAmount = computed(() => Object.values(picked).reduce((a,b)=>a+b,0))

async function submit() {
  if (!betCount.value) return Toast.warning({ content:'请先选择投注' })
  // TODO: 在这里调用你的下单接口
  Toast.success('已提交下单（示例）')
  clear()
}
</script>

<style scoped>
/* 关键：保证弹层内能接收点击 */
.desk { display:flex; flex-direction:column; height:100%; padding:10px 12px; pointer-events:auto; }
.panel { overflow:auto; -webkit-overflow-scrolling:touch; padding-bottom:8px; }
.grid { display:grid; gap:10px; margin-bottom:10px; }
.grid-2 { grid-template-columns: repeat(2,1fr); }
.grid-3 { grid-template-columns: repeat(3,1fr); }
.grid-4 { grid-template-columns: repeat(4,1fr); }

.desk-top{ display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:8px; margin-bottom:8px;}
.tabs{ display:inline-flex; background:#eef3fb; border-radius:16px; padding:2px; justify-self:center; }
.tab{ border:none; background:transparent; padding:6px 12px; font-size:13px; color:#4b5563; border-radius:14px;}
.tab.active{ background:#fff; color:#0f172a; box-shadow:0 1px 2px rgba(0,0,0,.04);}

.chips{ display:flex; align-items:center; gap:8px; margin: 8px 2px 12px;}
.chip{ min-width:46px; height:30px; padding:0 12px; border-radius:16px; background:#fff; border:1px solid #e7ecf5; color:#334155; box-shadow:0 1px 2px rgba(17,24,39,.04); font-weight:600;}
.chip.active{ background:#4da3ff; border-color:#4da3ff; color:#fff;}

.ops{ display:flex; align-items:center; justify-content:space-between; gap:8px;}
.sum{ font-size:13px; color:#6b7280;}
.btns{ display:flex; gap:10px;}
.btn{ height:34px; padding:0 14px; border-radius:8px; border:1px solid transparent; font-weight:700;}
.btn.ghost{ background:#fff; border-color:#e7ecf5; color:#374151;}
.btn.primary{ background:#4da3ff; color:#fff;}
.btn.primary:disabled{ background:#cfe4ff; color:#fff;}
</style>
