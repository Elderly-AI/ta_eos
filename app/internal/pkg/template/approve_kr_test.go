package template

import (
	"fmt"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestKrTemplateUI_Parse(t *testing.T) {
	t.Run("should be ok on init value", func(t *testing.T) {
		facade := New()

		data := map[string]interface{}{
			"what_to_do":    "Первая контрольная работа",
			"template_name": "first",
			"UI": []interface{}{
				map[string]interface{}{
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
									"name":  "A",
									"value": "10",
								},
								map[string]interface{}{
									"name":  "B",
									"value": "20",
								},
								map[string]interface{}{
									"name":  "-A",
									"value": "-10",
								},
								map[string]interface{}{
									"name":  "-B",
									"value": "-20",
								},
							},
						},
						map[string]interface{}{
							"name": "Прямой код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
							},
						},
						map[string]interface{}{
							"name": "Обратный код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
							},
						},
						map[string]interface{}{
							"name": "Дополнительный код",
							"data": []interface{}{
								map[string]interface{}{
									"name":  "A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "B",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-A",
									"value": nil,
								},
								map[string]interface{}{
									"name":  "-B",
									"value": nil,
								},
							},
						},
					},
				},
			},
		}

		data, err := facade.ApproveKr(data)
		require.NoError(t, err)
		fmt.Println(data)
	})
}
