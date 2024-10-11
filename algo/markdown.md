# 二叉树

## 参考文档
- https://labuladong.gitee.io/algo/zhun-bei-g-8db77/

```go

func buildTree(data []int) *Node {
	if len(data) < 1 {
		return nil
	}
	root := &Node{
		Value: data[0],
	}
	queue := []*Node{root}
	from := 1
	for {
		curNode := queue[0]
		if from > len(data)-1 {
			break
		}
		curNode.Left = &Node{
			Value: data[from],
		}
		queue = append(queue, curNode.Left)
		from++
		if from > len(data)-1 {
			break
		}
		curNode.Right = &Node{
			Value: data[from],
		}
		queue = append(queue, curNode.Right)
		from++
		queue = queue[1:]
	}
	return root
}
```

## 层序遍历

```go
func printTree(root *Node) {
	if root == nil {
		return
	}
	queue := []*Node{root}
	level := 1
	for {
		if len(queue) < 1 {
			break
		}
		fmt.Printf("level->%d: ", level)
		tmpQueue := []*Node{}
		for _, node := range queue {
			fmt.Printf("%d ", node.Value)
			if node.Left != nil {
				tmpQueue = append(tmpQueue, node.Left)
			}

			if node.Right != nil {
				tmpQueue = append(tmpQueue, node.Right)
			}
		}
		queue = tmpQueue
		level++
		fmt.Println("")
	}
}
```

## 前序遍历

```go
func preTraverse(root *Node) {
	if root == nil {
		return
	}
	queue := []*Node{root}
	for {
		if len(queue) < 1 {
			break
		}

		last := queue[len(queue)-1]
		fmt.Printf("%d ", last.Value)
		queue = queue[0 : len(queue)-1]
		if last.Right != nil {
			queue = append(queue, last.Right)
		}

		if last.Left != nil {
			queue = append(queue, last.Left)
		}
	}
}
```

## 中序遍历

```go
func middleTraverse2(root *Node) {
	if root == nil {
		return
	}

	queue := []*Node{}
	curNode := root

	for {
		if curNode == nil && len(queue) < 1 {
			break
		}
		for curNode != nil {
			queue = append(queue, curNode)
			curNode = curNode.Left
		}
		lastNode := queue[len(queue)-1]
		fmt.Printf("%d ", lastNode.Value)
		queue = queue[0 : len(queue)-1]
		curNode = lastNode.Right
	}
}
```
## 后序遍历

```go
func backTraverse(root *Node) {
	if root == nil {
		return
	}

	queue := []*Node{root}
	list := []*Node{}

	for {
		if len(queue) < 1 {
			break
		}
		first := queue[len(queue)-1]
		queue = queue[0 : len(queue)-1]
		if first.Left != nil {
			queue = append(queue, first.Left)
		}
		if first.Right != nil {
			queue = append(queue, first.Right)
		}
		list = append(list, first)
	}
	for i := range list {
		fmt.Printf("%d ", list[len(list)-i-1].Value)
	}
}
```


# 链表


## 翻转链表

- 递归版本

```go
func ReverseLinkList1(head *Node) *Node {
	if head == nil || head.Next == nil {
		return head
	}
	newHead := ReverseLinkList1(head.Next)
	head.Next.Next = head
	head.Next = nil

	return newHead
}
```

- 非递归版本

```go
func ReverseLinkList2(head *Node) *Node {
	if head == nil || head.Next == nil {
		return head
	}

	var (
		preNode  *Node
		curNode  *Node = head
		nextNode *Node
	)

	for curNode != nil {
		nextNode = curNode.Next
		curNode.Next = preNode
		preNode = curNode
		curNode = nextNode

	}
	return preNode
}
```


## K个一组翻转链表

```go
func ReverseLinkListK(head *Node, k int64) *Node {
	if head == nil || head.Next == nil {
		return head
	}
	if k == 1 {
		return head
	}
	newHead := ReverseLinkListK(head.Next, k-1)
	head.Next.Next = head
	head.Next = nil

	return newHead
}

func ReverseLinkByStep(head *Node, step int64) *Node {
	if step <= 1 {
		return head
	}

	var (
		curNode *Node = head
		newHead *Node = head
	)
	for i := 0; i < int(step); i++ {
		if curNode != nil {
			curNode = curNode.Next
		} else {
			return head
		}
	}
	newHead = ReverseLinkListK(head, step)
	head.Next = ReverseLinkByStep(curNode, step)
	return newHead
}

```

# 动态规划

## 最长递增子序列

> 题目：https://labuladong.gitee.io/algo/di-er-zhan-a01c6/dong-tai-g-a223e/dong-tai-g-6ea57/

```go
func subSequenceLen(list []int) int {
	dp := make([]int, len(list))
	dp[0] = 1

	for i := 1; i < len(list); i++ {
		for j := 0; j < i; j++ {
			if list[j] > list[i] {
				dp[i] = util.Max(dp[i-1], dp[j]+1)
			}
		}
	}
	return util.Max(dp...)
}
```

## 硬币凑钱数

> https://leetcode.cn/problems/coin-change/submissions/

```go

func coinChange(coins []int, amount int) int {

	if amount < 0 {
		return -1
	}

	if amount < 1 {
		return 0
	}
	table := make([]int, amount+1)

	for i := 1; i <= amount; i++ {
		table[i] = math.MaxInt
		for _, c := range coins {
			if i-c >= 0 {
				if table[i-c] != math.MaxInt {
					table[i] = min(table[i], table[i-c]+1)
				}
			}
		}
	}
	if table[amount] == math.MaxInt {
		return -1
	}
	return table[amount]
}
```

## 下降路径最小和

> https://leetcode.cn/problems/minimum-falling-path-sum/submissions/

```go
func minFallingPathSum(matrix [][]int) int {
	data := minWays(matrix)
	result := math.MaxInt
	for _, item := range data {
		result = min(result, item)
	}
	return result
}

func minWays(matrix [][]int) []int {
	if len(matrix) < 1 {
		return []int{}
	}

	if len(matrix) == 1 {
		return matrix[0]
	}

	result := make([]int, len(matrix[0]))
	minSums := minWays(matrix[1:])
	for index, val := range matrix[0] {
		result[index] = val + minSums[index]
		if index-1 >= 0 {
			result[index] = min(result[index], val+minSums[index-1])
		}

		if index+1 <= len(matrix[0]) {
			result[index] = min(result[index], val+minSums[index+1])
		}
	}
	return result
}
```

## 不同的子序列

> https://leetcode.cn/problems/distinct-subsequences/

```go
func numDistinct(s string, t string) int {

	if len(s) < len(t) {
		return 0
	}

	if len(t) < 1 {
		return 1
	}

	if s == t {
		return 1
	}
	result := 0
	for i, b := range []byte(s) {
		if b == t[0] {
			result += numDistinct(s[i+1:], t[1:])
		}
	}
	return result
}
```

## 全排列

> https://leetcode.cn/problems/distinct-subsequences/

```go
func getFullOrder(str string) []string {
	if len(str) < 1 {
		return nil
	}
	if len(str) < 2 {
		return []string{str}
	}
	bytes := []byte(str)
	result := []string{}
	for i := 0; i < len(bytes); i++ {
		if i-1 > -1 && bytes[i] == bytes[i-1] {
			continue
		}
		bytes[0], bytes[i] = bytes[i], bytes[0]
		orders := getFullOrder(string(bytes[1:]))
		for _, item := range orders {
			tmp := make([]byte, len(item)+1)

			copy(tmp, bytes[0:1])
			copy(tmp[1:], item)
			result = append(result, string(tmp))
		}
		bytes[i], bytes[0] = bytes[0], bytes[i]
	}
	return result
}
```

# 普通算法


## 16进制转2进制

```go
func main() {

	fmt.Println(transferBit2Str("11101"))
	fmt.Println(transferNum2Bit(29, 16, "0123456789ABCDEF"))
	fmt.Println(transfer2To16("11101"))
}

func transfer2To16(str string) string {
	if len(str) < 1 {
		return ""
	}

	var (
		mapping string = "0123456789ABCDEF"
		size16  int    = 16
		rest    int    = len(str) % 4
		segmant int    = len(str) / 4
	)

	result := []string{}
	if rest > 0 {
		result = append(result, transferNum2Bit(transferBit2Str(str[0:rest]), size16, mapping))
	}

	if segmant > 0 {
		for i := 0; i < segmant; i++ {
			from := i*4 + rest
			result = append(result, transferNum2Bit(transferBit2Str(str[from:from+4]), size16, mapping))

		}
	}

	return strings.Join(result, "")

}

func transferNum2Bit(num int, size int, chars string) string {

	if len(chars) < size {
		panic("chars mapping length error")
	}

	result := []byte{}
	for num > 0 {
		res := num % size
		result = append(result, chars[res])
		num = num / size
	}
	for i := 0; i < len(result)/2; i++ {
		result[i], result[len(result)-1-i] = result[len(result)-1-i], result[i]
	}
	return string(result)
}

func transferBit2Str(str string) int {
	offset := len(str) - 1
	result := 0
	for _, b := range str {
		if b == '1' {
			result += int(math.Pow(2, float64(offset)))
		}
		offset--
	}
	return result
}
```

## Bitmap

```go
func main() {

	fmt.Println(0 >> 5)
	object := NewFigure(128)
	object.Set(100)
	object.Set(99)
	object.Set(10)
	fmt.Println(object.Exists(100))
	fmt.Println(object.Exists(99))
	object.Delete(100)
	fmt.Println(object.Exists(100))
	fmt.Println(object.Exists(99))

}

type Figure struct {
	Storage []uint
	MaxSize int
}

func NewFigure(maxSize int) *Figure {
	index, offset := cal(maxSize)
	if offset > 0 {
		index += 1
	}
	return &Figure{
		Storage: make([]uint, index),
		MaxSize: index*8 - 1,
	}
}

func cal(num int) (int, int) {
	return num / 8, num % 8
}

func (f *Figure) Set(num int) bool {
	index, offset := cal(num)
	f.Storage[index] |= 1 << offset
	return true
}

func (f *Figure) Echo() {
	for _, item := range f.Storage {
		fmt.Println(strconv.FormatInt(int64(item), 2))
	}
}

func (f *Figure) Exists(num int) bool {
	index, offset := cal(num)
	return f.Storage[index]>>offset > 0
}

func (f *Figure) Delete(num int) bool {
	index, offset := cal(num)
	f.Storage[index] &= ^(1 << offset)
	return true
}
```

## 字符串相乘

```go
func multiply(str1 string, str2 string) string {
	if len(str1) < 1 || len(str2) < 1 {
		return "0"
	}

	str1Bytes := []byte(str1)
	str2Bytes := []byte(str2)
	mulResult := make([]int, len(str1Bytes)+len(str2Bytes))
	for i := len(str1Bytes) - 1; i >= 0; i-- {
		for j := len(str2Bytes) - 1; j >= 0; j-- {
			mul := int(str1Bytes[i]-'0') * int(str2Bytes[j]-'0')
			p1 := i + j
			p2 := i + j + 1
			sum := int(mul) + mulResult[p2]
			mulResult[p1] = sum / 10
			mulResult[p2] = sum % 10
		}
	}

	var (
		index int
	)
	for i, a := range mulResult {
		if a != 0 {
			index = i
			break
		}
	}
	result := []byte{}
	for i := index; i <= len(mulResult)-1; i++ {
		result = append(result, byte('0'+mulResult[i]))
	}
	fmt.Println(string(result))
	return string(result)
}
```

## 括号对生成

```go

func generateParenthesis(count int) []string {
	list := &[]string{}
	backtrace1(count, count, []byte{}, list)
	for _, v := range *list {
		fmt.Println(v)
	}
	return *list
}

func backtrace1(left, right int, current []byte, list *[]string) {
	if left > right {
		return
	}
	if left < 0 || right < 0 {
		return
	}

	if left == 0 && right == 0 {
		*list = append(*list, string(current))
		return
	}

	current = append(current, '(')
	backtrace1(left-1, right, current, list)
	current = current[0 : len(current)-1]

	current = append(current, ')')
	backtrace1(left, right-1, current, list)
	current = current[0 : len(current)-1]
}
```




