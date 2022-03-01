package template

import (
	"fmt"
	"testing"
)

func TestKrTemplateUI_Parse(t *testing.T) {
	t.Run("should be ok on init value", func(t *testing.T) {
		var kr KrTemplateUI

		data := map[string]interface{}{
			"name": "table",
			"data": []interface{}{
				map[string]interface{}{
					"name": "Переменные",
					"data": []interface{}{
						map[string]interface{}{
							"name":  "A",
							"value": "A",
						},
						map[string]interface{}{
							"name":  "B",
							"value": "B",
						},
						map[string]interface{}{
							"name":  "-A",
							"value": "-A",
						},
						map[string]interface{}{
							"name":  "-B",
							"value": "-B",
						},
					},
				},
				map[string]interface{}{
					"name": "Значения",
					"data": []interface{}{
						map[string]interface{}{
							"name":  "valueA",
							"value": "bitA",
						},
						map[string]interface{}{
							"name":  "valueB",
							"value": "bitB",
						},
						map[string]interface{}{
							"name":  "-valueA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-valueB",
							"value": "nil",
						},
					},
				},
				map[string]interface{}{
					"name": "Прямой код",
					"data": []interface{}{
						map[string]interface{}{
							"name":  "prA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "prB",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-prA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-prB",
							"value": "nil",
						},
					},
				},
				map[string]interface{}{
					"name": "Обратный код",
					"data": []interface{}{
						map[string]interface{}{
							"name":  "obrA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "obrB",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-obrA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-obrB",
							"value": "nil",
						},
					},
				},
				map[string]interface{}{
					"name": "Дополнительный код",
					"data": []interface{}{
						map[string]interface{}{
							"name":  "dopA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "dopB",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-dopA",
							"value": "nil",
						},
						map[string]interface{}{
							"name":  "-dopB",
							"value": "nil",
						},
					},
				},
			},
		}

		err := kr.Parse(data)
		fmt.Println(err)
	})
}
